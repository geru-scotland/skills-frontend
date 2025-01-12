const badgesData = [
    {
        rango: 'Observador',
        bitpoints_min: 0,
        bitpoints_max: 9,
        png: '00-observador.png',
        descripcion: 'Te gusta ojear las cosas. Todavía no te has atrevido a experimentar con circuitos digitales'
    },
    {
        rango: 'Aspirante a Cadete',
        bitpoints_min: 2,
        bitpoints_max: 11,
        png: '01-Aspirante-cadete.png',
        descripcion: 'Todavía no has ingresado en la academia Jedi de hardware, pero tienes interés, y te gustaría probar'
    },
    {
        rango: 'Cadete',
        bitpoints_min: 5,
        bitpoints_max: 14,
        png: '02-cadete.png',
        descripcion: '¡Bienvenido a la academia Jedi de hardware! Tienes curiosidad e Interés suficiente sobre hardware y tienes Icestudio instalado. ¡Listo para aprender!'
    },
    {
        rango: 'Cadete nivel-1',
        bitpoints_min: 15,
        bitpoints_max: 24,
        png: '03-cadete-N1.png',
        descripcion: 'Tu conocimiento de las herramientas libres del Patrimonio tecnológico de la Galaxia es considerable. Ya sabes cómo ver "las tripas" de los diseños libres: electrónica y mecánica'
    },
    {
        rango: 'Cadete nivel-2',
        bitpoints_min: 25,
        bitpoints_max: 34,
        png: '04-cadete-N2.png',
        descripcion: 'Ya sabes sintetizar circuitos simples desde cero para encender leds. Comprendes los bits perfectamente'
    },
    {
        rango: 'Cadete nivel-3',
        bitpoints_min: 40,
        bitpoints_max: 49,
        png: '05-cadete-N3.png',
        descripcion: 'Sabes instalar y utilizar las colecciones. La síntesis y carga de circuitos básicos ya no tiene secretos para tí'
    },
    {
        rango: 'Aspirante a Padawan',
        bitpoints_min: 60,
        bitpoints_max: 69,
        png: '06-Aspirante-padawan.png',
        descripcion: 'Conoces las propiedades de paralelismo del hardware, y las sabes utilizar. Bombeas bits. Haces manipulaciones básicas con bits'
    },
    {
        rango: 'Aspirante a Padawan Nivel 1',
        bitpoints_min: 80,
        bitpoints_max: 89,
        png: '07-Aspirante-padawan-N1.png',
        descripcion: 'Manejas los LEDs internos y externos con mucha soltura. Sabes conectar circuitos externos y hacerlos en diferentes soportes'
    },
    {
        rango: 'Aspirante a Padawan Nivel 2',
        bitpoints_min: 100,
        bitpoints_max: 109,
        png: '08-Aspirante-padawan-N2.png',
        descripcion: 'Sabes hacer circuitos digitales con entradas y salidas. Has practicado tus habilidades hardware moviendo Servos'
    },
    {
        rango: 'Aspirante a Padawan Nivel 3',
        bitpoints_min: 120,
        bitpoints_max: 129,
        png: '09-Aspirante-padawan-N3.png',
        descripcion: 'Ya sabes hacer circuitos combinacionales básicos con puertas AND y NOT. Tu manipulación de bits progresa adecuadamente'
    },
    {
        rango: 'Padawan',
        bitpoints_min: 150,
        bitpoints_max: 159,
        png: '10-Padawan.png',
        descripcion: 'Empiezas a dominar los periféricos básicos de entrada salida. Sabes emitir tus primeros sonidos'
    },
    {
        rango: 'Padawan Nivel 1',
        bitpoints_min: 180,
        bitpoints_max: 189,
        png: '11-Padawan-N1.png',
        descripcion: 'Sabes utilizar los multiplexores, y ya manejas los servos de rotación contínua. Sabes como hacer tus primeros robots móviles'
    },
    {
        rango: 'Padawan Nivel 2',
        bitpoints_min: 210,
        bitpoints_max: 219,
        png: '12-Padawan-N2.png',
        descripcion: 'Ya tienes experiencia con sensores de IR. Has construido tus primeros robots reactivos con FPGA'
    },
    {
        rango: 'Padawan Nivel 3',
        bitpoints_min: 240,
        bitpoints_max: 249,
        png: '13-Padawan-N3.png',
        descripcion: 'Ya sabes manejar las tres pueras lógicas básicas, con las que puedes hacer cualquier circuito combinacional'
    },
    {
        rango: 'Aspirante a Jedi',
        bitpoints_min: 270,
        bitpoints_max: 279,
        png: '14-Aspirante-jedi.png',
        descripcion: 'Conoces los secretos de los circuitos paramétricos y el uso de las tablas de verdad para diseñar circuitos combinacionales'
    },
    {
        rango: 'Aspirante a Jedi Nivel 1',
        bitpoints_min: 300,
        bitpoints_max: 309,
        png: '15-Aspirante-jedi-N1.png',
        descripcion: 'Ya has pasado de usar bits aislados a números, que se transmiten por los Buses. Tu capacidad para crear circuitos complejos ha aumentado'
    },
    {
        rango: 'Aspirante a Jedi Nivel 2',
        bitpoints_min: 330,
        bitpoints_max: 339,
        png: '16-Aspirante-jedi-N2.png',
        descripcion: 'Conoces el secreto de la creación de bloques, y sabes diseñar circuitos combinacionales de cualquier número de entradas y salidas, a partir de sus tablas de verdad'
    },
    {
        rango: 'Aspirante a Jedi Nivel 3',
        bitpoints_min: 360,
        bitpoints_max: 369,
        png: '17-Aspirante-jedi-N3.png',
        descripcion: '¡Ya sabes crear tus propias colecciones!'
    },
    {
        rango: 'Jedi',
        bitpoints_min: 400,
        bitpoints_max: 409,
        png: '18-Jedi.png',
        descripcion: 'Has descubierto el secreto de los biestables, y esto te abre el camino para aprender circuitos secuenciales. Tu poder de Jedi Hardware ha aumentado considerablemente...'
    },
    {
        rango: 'Jedi Nivel 1',
        bitpoints_min: 440,
        bitpoints_max: 449,
        png: '19-Jedi-N1.png',
        descripcion: 'Sabes medir el tiempo y contar eventos. Tus circuitos secuenciales aumentan en complejidad'
    },
    {
        rango: 'Jedi Nivel 2',
        bitpoints_min: 480,
        bitpoints_max: 489,
        png: '20-Jedi-N2.png',
        descripcion: 'Ya trabajas con datos. Conoces sus componentes fundamentales y sabes compararlos y almacenarlos'
    },
    {
        rango: 'Jedi Nivel 3',
        bitpoints_min: 520,
        bitpoints_max: 529,
        png: '21-Jedi-N3.png',
        descripcion: 'Sabes hacer circuitos con la capacidad de comunicarse con el PC y otros dispositivos, por medio de la transmisión serie'
    },
    {
        rango: 'Caballero Jedi',
        bitpoints_min: 600,
        bitpoints_max: 609,
        png: '22-Caballero-Jedi.png',
        descripcion: '¡Has completado el curso de Electrónica Digital para makers con FPGAs libres! Eres capaz de hacer circuitos digitales de mediana complejidad. ¡Enhorabuena!'
    }
]

export default badgesData;