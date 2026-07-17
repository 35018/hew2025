import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';

type Event = {
    title:string,
    start:string,
    end:string
}

type Props={
    date:string,
    events:Event[],
    eventClick:()=>void
}


export default function Timeline({date,events,eventClick}:Props){

    return(
            <FullCalendar
            locale={'jp'}
            timeZone="UTC"
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            initialDate={date}
            events={
                events
            }
            eventClick={eventClick}
            height={550}
            viewClassNames={"mb-5"}

            />
    )
}