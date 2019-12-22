import { Component, h } from "@stencil/core";

@Component({
    tag:'elijah-date-picker',
    styleUrl: 'date-picker.css',
    shadow:true
})
export class DatePicker{
    
    render(){
        const datePicker = (
            <div class="date-picker">
                <h1 class="current-date">22/22/2019</h1>
                <header class="date-picker__navigation">
                    <button class="previous-month">&lt;</button>
                    <h2 class="current-month">December</h2>
                    <button class="next-month">&lt;</button>

                </header>
                <main class="date-picker__month">
                    <section class="month-content">
                        <div class="month-content__week-days">
                            
                        </div>
                        <div class="month-content__month-days">
    
                        </div>
                    </section>
                    
                </main>
            </div>
        )
        return datePicker;
    }
}