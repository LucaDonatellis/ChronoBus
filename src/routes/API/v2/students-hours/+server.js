const studentsHours = [
    {
        className: "Ingegneria del software",
        department: "Povo 1",
        lines: ["5","5/"],
        lessons: [
            { day: 1, start: "10:30", end: "13:30" },
            { day: 2, start: "8:30", end: "11:30" },
            { day: 3, start: "8:30", end: "10:30" },
        ],
        students: 100,
        attendenceRate: 0.8,
    },
    {
        className: "Organizzazione e gestione Aziendale",
        department: "Povo 2",
        lines: ["5","5/"],
        lessons: [
            { day: 0, start: "8:30", end: "10:30" },
            { day: 3, start: "13:30", end: "15:30" },
        ],
        students: 80,
        attendenceRate: 0.75,
    },
]
const studentsUsingBus = 0.8;


export async function GET({ request, url }) {
    const dayParam = url.searchParams.get('date');
    if (!dayParam) {
        return new Response(JSON.stringify({ error: 'Date parameter is required' }), { status: 400 });
    }    

    try {
        const classes = studentsHours.filter(classTime => classTime.hours.some(lessons => lesson.day === (new Date(dayParam).getDay()+6)%7));
        
        return new Response(JSON.stringify(reports), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}