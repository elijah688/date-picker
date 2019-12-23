import { Component, Listen, State, h } from "@stencil/core";

@Component({
    tag:'elijah-display-date',
    styleUrl:'display-date.css',
    shadow:true
})
export class DisplayDate{


   @State() date:string;

   @Listen('selectedDateEvent',  { target: 'body'})
   selectedDateEventHandled(event: CustomEvent) {
    this.date = event.detail;
    console.log('Received the custom todoCompleted event: ', event.detail);
   }


    render(){
        let date:string;
        console.log(this.date)
        if(this.date){
            date = this.date.toString();
        }
        else{
            date = 'NO DATE YET!!'
        }
        return(<h1>{date}</h1>)
    }
}