import { Component, h, State, Method, Prop, Event, EventEmitter } from "@stencil/core";

enum WeekDays {
    Monday = 'Monday', 
    Tuesday = 'Tuesday', 
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday',
}

enum Months {
    January = 'January',
    February =  'February',
    March =  'March',
    April =  'April',
    May =  'May',
    June =  'June',
    July =  'July',
    August =  'August',
    September =  'September',
    October =  'October',
    November =  'November',
    December =  'December'
}

@Component({
    tag:'elijah-date-picker',
    styleUrl: 'date-picker.css',
    shadow:true
})
export class DatePicker{

    @State() selectedDate:Date;

    @State() selectedDay:number;
    @State() selectedMonth:number;
    @State() selectedYear:number;

    @State() isOpen:boolean;

    @Prop() color:string;
    @Event({
        eventName: 'selectedDateEvent',
        composed: true,
        bubbles: true,
      }) dateEventEmitter: EventEmitter;
    
      selectedDateEventHandler():void {
        console.log(this.selectedDate)
        this.dateEventEmitter.emit(this.selectedDate);
      }

    @Method()
    open():void{
        this.isOpen = true;
    }

    @Method()
    close():void{
        this.isOpen = false;
    }

    private toggle():void{
        this.isOpen = !this.isOpen;
    }
    private _generateWeekDays():string[]{
        const week = Array.from(Array(7).keys())
        const weekSymbols:string[] = week.map(d=>Object.keys(WeekDays)[d].substring(0,1));
        return weekSymbols;
    }
    private _generateMonthDays(month:number):number{
        if(month<=6){
            if(month===1){
                return this._handleFebruary();
            }
            if(month%2===0){
                return 31;
            }
            else{
                return 30;
            }
        }
        else{
            if(month%2===0){
                return 30;
            }
            else{
                return 31;
            }
        }
    }

    private _handleFebruary():number{
        if(this.selectedYear%4===0){
            return 29;
        }
        else{
            return 28;
        }

    }

    private _getDeficitDays(firstDayWeekValue:number):number{

        //monday =     0 1
        //tuesday =    1 2
        //wednesday =  2 3
        //trursday =   3 4
        //friday =     4 5
        //saturday=    5 6
        //sunday =     6 0

        if(firstDayWeekValue===0){
            return  6;
        }
        else{
            return firstDayWeekValue - 1;
        }
    }
    private _getSupplementaryDays(days:number[]):number[]{
        const firstDayWeekValue:number = this._generateDate(days[0], this.selectedMonth,this.selectedYear).getDay();
        
        const deficitDays:number = this._getDeficitDays(firstDayWeekValue);
        let previousMonth:number = this.selectedMonth-1;
        if(this.selectedMonth===0){
            previousMonth=11;
        }

        const numberOfDays:number = this._generateMonthDays(previousMonth);
        const lastMontDays:number[] = Array.from(Array(numberOfDays).keys()).slice((numberOfDays-deficitDays),numberOfDays).map(d=>d+1);
        
        return lastMontDays
    }


    private _getRemainingDays(days:number[], suppDays:number[]):number[]{
        
        const surplusDaysCount:number = 42 - (days.length + suppDays.length);
        let nextMonth:number = this.selectedMonth + 1;
        if(this.selectedMonth===11){
            nextMonth=0;
        }
        const nextMonthDays:number = this._generateMonthDays(nextMonth);
        
        const surplusDays:number[] = Array.from(Array(this._generateMonthDays(nextMonthDays)).keys()).map(d=>d+1).slice(0,surplusDaysCount);
        return surplusDays;
    }



    componentWillLoad(){
        this.selectedDate = new Date();
        this.selectedDay = this.selectedDate.getDate();
        this.selectedMonth = this.selectedDate.getMonth();
        this.selectedYear = this.selectedDate.getFullYear();

        this.isOpen = false;
    }

    private _generateDate(day:number,month:number, year:number):Date{
        const currentDate:Date = new Date();
        const currentTimeString:string = `${currentDate.toLocaleTimeString()} `
        const dateString:string = `${month+1} ${day}  ${year} ${currentTimeString}`;
        return  new Date(dateString)
    }

    private _updateSelectedDate(event:Event):void{
        event.preventDefault();
        const day:string = (event.target as HTMLAnchorElement).innerHTML
        this.selectedDay = +day;

        this.selectedDate = this._generateDate(this.selectedDay,this.selectedMonth,this.selectedYear)
        this.selectedDateEventHandler();
    }


    
    private _goToNextMonth():void{
        if(this.selectedMonth===0 && this.selectedDay>this._handleFebruary()){
            this.selectedDay=this._handleFebruary()
        }

        if(this.selectedMonth===11){
            this.selectedMonth = 0;
            this.selectedYear++;
        }
        
        else{
            this.selectedMonth++;
        }

        this.selectedDate = this._generateDate(this.selectedDay, this.selectedMonth, this.selectedYear)
        this.selectedDateEventHandler();

    }

    private _goToPreviousMonth():void{
        if(this.selectedMonth===2 && this.selectedDay>this._handleFebruary()){
            this.selectedDay=this._handleFebruary()
        }

        if(this.selectedMonth===0){
            this.selectedMonth = 11;
            this.selectedYear--;
        }
        else{
            this.selectedMonth--;
        }

        this.selectedDate = this._generateDate(this.selectedDay, this.selectedMonth, this.selectedYear)
        this.selectedDateEventHandler();

    }

    private _onPreviousMonthDaySelected(event:Event):void{
        event.preventDefault()
        this.selectedDay = +(event.target as HTMLAnchorElement).innerHTML;
        this._goToPreviousMonth();
    }

    private _onNextMonthDaySelected(event:Event):void{
        event.preventDefault()
        this.selectedDay = +(event.target as HTMLAnchorElement).innerHTML;
        this._goToNextMonth();
    }

   

    render(){
        
        const daysInCurrentMonth:number = this._generateMonthDays(this.selectedMonth);
        
        const days:number[] = (Array.from(Array(daysInCurrentMonth).keys()).map(d=>d+1));
        const supplementaryDays:number[] = this._getSupplementaryDays(days);
        const remainingDays:number[] = this._getRemainingDays(days, supplementaryDays);
        

        const weekDays:string[] = this._generateWeekDays();

        const datePicker = (
            <div class="date-picker">
                <div class="date-display">
                    <button class="drop-down"  onClick={this.toggle.bind(this)}>{this.isOpen===true ? `${'Λ'}` : 'V'}</button>
                    <h1 class="current-date">{[this.selectedDay].map(d=>d<=9 ? "0" + d : d)}/{[this.selectedMonth+1].map(m=>m<=9? '0' + m : m)[0]}/{this.selectedYear}</h1>
                </div>
                
                <div class={this.isOpen===true ? 'date-picker__body--opened' : 'date-picker__body--closed'}>
                    <header class="date-picker__navigation">
                        <button onClick={this._goToPreviousMonth.bind(this)} class="previous-month">&lt;</button>
                        <h2 class="current-month">{Object.keys(Months)[this.selectedMonth]}</h2>
                        <button onClick={this._goToNextMonth.bind(this)} class="next-month">&gt;</button>
                    </header>
                    <main class="date-picker__month">
                        <section class="month-content">
                            <div class="month-content__week-days">
                                {weekDays.map(d=>
                                    <h4 class="week-day">{d}</h4>
                                )
                                }
                            </div>
                            <div class="month-content__month-days">
                                {supplementaryDays.map(d=>
                                    <a class='supplementary-day' onClick={this._onPreviousMonthDaySelected.bind(this)} href="#" >{d}</a>
                                )
                                }
                                {days.map(d=>
                                    <a class={`class1 ${this._generateDate(d,this.selectedMonth,this.selectedYear).getDay()===0 || this._generateDate(d,this.selectedMonth,this.selectedYear).getDay()===6  ? 'weekend' : 'day'} class2 ${d===this.selectedDay ? 'selected-day' : ''}`} onClick={this._updateSelectedDate.bind(this)} href="#" >{d}</a>
                                )
                                }
                                {remainingDays.map(d=>
                                    <a class='supplementary-day' onClick={this._onNextMonthDaySelected.bind(this)} href="#" >{d}</a>
                                )
                                }
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        )
        return datePicker;
    }
}