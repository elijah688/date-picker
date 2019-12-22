import { Component, h, State } from "@stencil/core";

enum WeekDays {
    Monday = 'Monday', 
    Tuesday = 'Tuesday', 
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday'
}

// enum Months {
//     January = 'January',
//     February =  'February',
//     March =  'March',
//     April =  'April',
//     May =  'May',
//     June =  'June',
//     July =  'July',
//     August =  'August',
//     September =  'September',
//     October =  'October',
//     November =  'November',
//     December =  'December'
// }

@Component({
    tag:'elijah-date-picker',
    styleUrl: 'date-picker.css',
    shadow:true
})
export class DatePicker{

    @State() currentDate:Date;

    @State() currnetDay:number;
    @State() currentMonth:number;
    @State() currentYear:number;


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
        if(this.currentYear%4===0){
            return 29;
        }
        else{
            return 28;
        }

    }
    componentWillLoad(){
        this.currentDate = new Date();
        this.currnetDay = this.currentDate.getDate();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        
        // const months:number[] = Array.from(Array(12).keys())

        // const monthDays = months.map(m=>this._generateMonthDays(m))
        // console.log(monthDays)
        
    }


    render(){
        const daysInCurrentMonth:number = this._generateMonthDays(this.currentMonth);
        const days:number[] = Array.from(Array(daysInCurrentMonth).keys()).map(d=>d+1);
        const weekDays:string[] = Object.keys(WeekDays).map(d=>d.substring(0,1));

        const datePicker = (
            <div class="date-picker">
                <h1 class="current-date">22/22/2019</h1>
                <header class="date-picker__navigation">
                    <button class="previous-month">&lt;</button>
                    <h2 class="current-month">December</h2>
                    <button class="next-month">&gt;</button>

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
                            {days.map(d=>
                                <a href="#" class="day">{d}</a>
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