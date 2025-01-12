const skillsData = [
    {
        "id": "1",
        "text": "Light up an /LED for the first /time",
        "icon": "icon1.svg"
    },
    {
        "id": "2",
        "text": "Learn to /use wire strippers",
        "icon": "icon2.svg"
    },
    {
        "id": "3",
        "text": "Complete /an electronics kit",
        "icon": "icon3.svg"
    },
    {
        "id": "4",
        "text": "Learn to Solder",
        "icon": "icon4.svg"
    },
    {
        "id": "5",
        "text": "Learn to use /a breadboard",
        "icon": "icon5.svg"
    },
    {
        "id": "6",
        "text": "Get a circuit /wrong and try /again",
        "icon": "icon6.svg"
    },
    {
        "id": "7",
        "text": "Learn Ohm’s /Law",
        "icon": "icon7.svg"
    },
    {
        "id": "8",
        "text": "Fix something /something /that’s broken",
        "icon": "icon8.svg"
    },
    {
        "id": "9",
        "text": "Measure /voltage with /a multimeter",
        "icon": "icon9.svg"
    },
    {
        "id": "10",
        "text": "Learn to /read a schematic",
        "icon": "icon10.svg"
    },
    {
        "id": "11",
        "text": "Learn to read /a datasheet",
        "icon": "icon11.svg"
    },
    {
        "id": "12",
        "text": "Learn to /control the /brightness of /an LED",
        "icon": "icon12.svg"
    },
    {
        "id": "13",
        "text": "Learn to /desolder a /through hole /component",
        "icon": "icon4.svg"
    },
    {
        "id": "14",
        "text": "Make /something that /makes noise",
        "icon": "icon14.svg"
    },
    {
        "id": "15",
        "text": "Turn a /breadboard /circuit into a /schematic",
        "icon": "icon10.svg"
    },
    {
        "id": "16",
        "text": "Measure /current with a /multimeter",
        "icon": "icon9.svg"
    },
    {
        "id": "17",
        "text": "Make a voltage /divider to lower /the voltage /for a project",
        "icon": "icon17.svg"
    },
    {
        "id": "18",
        "text": "Turn /something /on using /a sensor",
        "icon": "icon18.svg"
    },
    {
        "id": "19",
        "text": "Use a diode /protect your /circuit from /reverse voltages",
        "icon": "icon19.svg"
    },
    {
        "id": "20",
        "text": "Make an /oscillator that /makes noise",
        "icon": "icon14.svg"
    },
    {
        "id": "21",
        "text": "Use a relay /to switch /something on at /a higher voltage",
        "icon": "icon21.svg"
    },
    {
        "id": "22",
        "text": "Make a /capacitor rocket /(too much voltage)",
        "icon": "icon22.svg"
    },
    {
        "id": "23",
        "text": "Learn to /solder surfcace /mount parts",
        "icon": "icon23.svg"
    },
    {
        "id": "24",
        "text": "Use a /555 timer /in a circuit",
        "icon": "icon24.svg"
    },
    {
        "id": "25",
        "text": "Make a sound /louder with an /amplifier",
        "icon": "icon14.svg"
    },
    {
        "id": "26",
        "text": "Use /addressable /RGB LEDs in a /project",
        "icon": "icon12.svg"
    },
    {
        "id": "27",
        "text": "Make a /project /with a /Raspberry Pi",
        "icon": "icon27.svg"
    },
    {
        "id": "28",
        "text": "Let the /smoke out /accidentally",
        "icon": "icon28.svg"
    },
    {
        "id": "29",
        "text": "Use fritzing /or TinkerCAD /to create a /circuit diagram",
        "icon": "icon29.svg"
    },
    {
        "id": "30",
        "text": "Make /something /with Arduino",
        "icon": "icon30.svg"
    },
    {
        "id": "31",
        "text": "Let the smoke /out of an Arduino /accidentally",
        "icon": "icon31.svg"
    },
    {
        "id": "32",
        "text": "Measure /frequency with a /multimeter",
        "icon": "icon9.svg"
    },
    {
        "id": "33",
        "text": "Use an /Op-Amp  in /a circuit",
        "icon": "icon33.svg"
    },
    {
        "id": "34",
        "text": "Use a crowbar /circuit to protect /against over voltage",
        "icon": "icon17.svg"
    },
    {
        "id": "35",
        "text": "Use a surge /diode to protect /a circuit",
        "icon": "icon19.svg"
    },
    {
        "id": "36",
        "text": "Make /something /for a friend",
        "icon": "icon36.svg"
    },
    {
        "id": "37",
        "text": "Make a motor /controller with /a H Bridge",
        "icon": "icon37.svg"
    },
    {
        "id": "38",
        "text": "Make a /counter with /logic gates",
        "icon": "icon38.svg"
    },
    {
        "id": "39",
        "text": "Apply solder /paste to a PCB /with a stencil",
        "icon": "icon39.svg"
    },
    {
        "id": "40",
        "text": "Teach a /friend an /electronics skill",
        "icon": "icon40.svg"
    },
    {
        "id": "41",
        "text": "Make something /with a 7 /segment display",
        "icon": "icon41.svg"
    },
    {
        "id": "42",
        "text": "Measure /voltage with an /oscilloscope",
        "icon": "icon42.svg"
    },
    {
        "id": "43",
        "text": "Measure /capacitor equivalent /series resistance",
        "icon": "icon43.svg"
    },
    {
        "id": "44",
        "text": "Make an /Internet of Things /(IoT) project",
        "icon": "icon44.svg"
    },
    {
        "id": "45",
        "text": "Make /something with /solar panels",
        "icon": "icon45.svg"
    },
    {
        "id": "46",
        "text": "Look at an /audio input /on an oscilloscope",
        "icon": "icon46.svg"
    },
    {
        "id": "47",
        "text": "Make a /regulated /power supply",
        "icon": "icon47.svg"
    },
    {
        "id": "48",
        "text": "Use a MOSFET /instead of a relay /in a project",
        "icon": "icon48.svg"
    },
    {
        "id": "49",
        "text": "Make your /own /USB cable",
        "icon": "icon49.svg"
    },
    {
        "id": "50",
        "text": "Use an LED /matrix in /a project",
        "icon": "icon50.svg"
    },
    {
        "id": "51",
        "text": "Filter /unwanted noise /from a signal",
        "icon": "icon46.svg"
    },
    {
        "id": "52",
        "text": "Use a freqency /analyser /for a project",
        "icon": "icon9.svg"
    },
    {
        "id": "53",
        "text": "Order a /PCB with /your design",
        "icon": "icon47.svg"
    },
    {
        "id": "54",
        "text": "Repair a /broken trace /on a PCB",
        "icon": "icon54.svg"
    },
    {
        "id": "55",
        "text": "Use /automatic /gain control",
        "icon": "icon10.svg"
    },
    {
        "id": "56",
        "text": "Make a /PID circuit /with Op-Amps",
        "icon": "icon33.svg"
    },
    {
        "id": "57",
        "text": "Teach a /class on /Electronics",
        "icon": "icon40.svg"
    },
    {
        "id": "58",
        "text": "Learn /PCB Design /Software",
        "icon": "icon47.svg"
    },
    {
        "id": "59",
        "text": "Use an /e-paper display /in a project",
        "icon": "icon59.svg"
    },
    {
        "id": "60",
        "text": "Build a /Radio Frequency /(RF)Project",
        "icon": "icon60.svg"
    },
    {
        "id": "61",
        "text": "Make an /open source /project",
        "icon": "icon61.svg"
    },
    {
        "id": "62",
        "text": "Use capacitive /touch in a PCB /design",
        "icon": "icon62.svg"
    },
    {
        "id": "63",
        "text": "Make /something /with PCB Art",
        "icon": "icon63.svg"
    },
    {
        "id": "64",
        "text": "Make an /electronic /sculpture",
        "icon": "icon64.svg"
    },
    {
        "id": "65",
        "text": "Make a switch /mode power /supply",
        "icon": "icon21.svg"
    },
    {
        "id": "66",
        "text": "Release a /tutorial on a /project you've made",
        "icon": "icon66.svg"
    },
    {
        "id": "67",
        "text": "Create an /FPGA Project",
        "icon": "icon67.svg"
    },
    {
        "id": "68",
        "text": "Write your /own C/C++ library /for a sensor /from scratch",
        "icon": "icon68.svg"
    }
]

export default skillsData;