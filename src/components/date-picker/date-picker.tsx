import { Component, h, State } from "@stencil/core";

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

    private _generateWeekDays(days:number[]):string[]{
        // const week:number[] = days.map(d=>this._generateDate(d, this.selectedMonth, this.selectedYear).getDay())
        // console.log(week)
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



    componentWillLoad(){
        this.selectedDate = new Date();
        this.selectedDay = this.selectedDate.getDate();
        this.selectedMonth = this.selectedDate.getMonth();
        this.selectedYear = this.selectedDate.getFullYear();
        
        // const months:number[] = Array.from(Array(12).keys())

        // const monthDays = months.map(m=>this._generateMonthDays(m))
        // console.log(monthDays)

        // (d+m+y+[y/4]+c ) mod 7

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

        // console.log(this.selectedDate.toString())
    }


    
    private _goToNextMonth():void{
        if(this.selectedMonth===11){
            this.selectedMonth = 0;
            this.selectedYear++;
        }
        else{
            this.selectedMonth++;
        }

        this.selectedDate = this._generateDate(this.selectedDay, this.selectedMonth, this.selectedYear)
    }

    private _goToPreviousMonth():void{
        if(this.selectedMonth===0){
            this.selectedMonth = 11;
            this.selectedYear--;
        }
        else{
            this.selectedMonth--;
        }

        this.selectedDate = this._generateDate(this.selectedDay, this.selectedMonth, this.selectedYear)
    }

    private _goToSuppDate(event:Event):void{
        event.preventDefault()
        this._goToPreviousMonth();
        this.selectedDay = +(event.target as HTMLAnchorElement).innerHTML;

        this.selectedDate = this._generateDate(this.selectedDay, this.selectedMonth, this.selectedYear)
    }

    render(){
        
        const daysInCurrentMonth:number = this._generateMonthDays(this.selectedMonth);
        const days:number[] = (Array.from(Array(daysInCurrentMonth).keys()).map(d=>d+1));
        const supplementaryDays:number[] = this._getSupplementaryDays(days);
        const weekDays:string[] = this._generateWeekDays(days.slice(0,7));

        const datePicker = (
            <div class="date-picker">
                <h1 class="current-date">{[this.selectedDay].map(d=>d<=9 ? "0" + d : d)}/{[this.selectedMonth+1].map(m=>m<=9? '0' + m : m)[0]}/{this.selectedYear}</h1>
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
                                <a class='supplementary-day' onClick={this._goToSuppDate.bind(this)} href="#" >{d}</a>
                             )
                            }
                            {days.map(d=>
                                <a class={d===this.selectedDay ? 'selected-day' : 'day'} onClick={this._updateSelectedDate.bind(this)} href="#" >{d}</a>
                             )
                            }
                        </div>
                    </section>
                </main>
            </div>
        )
        return datePicker;
    }
}