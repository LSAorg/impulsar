# impulsar
## Plataforma de traducción de audio español a Lenguas de Señas Argentinas

La ausencia de mecanismos concretos que faciliten una integración efectiva de la población sorda a través de su lengua materna (Lenguas de Señas Argentinas) se transforma en un severo limitante que deriva en factor de exclusión y en una ampliación de las brechas de desigualdades en todos los ámbitos de manera transversal. En los espacios digitales, no existen herramientas masificadas que den respuesta a las necesidades puntuales de la población sorda, por lo tanto, esta situación deriva en el acceso desigualitario al contenido y al acceso restringido al entorno digital. Por esta razón, en este proyecto se desarrolló una plataforma de software libre encargada de recibir audios desde diversas fuentes y generar la traducción simultánea en Lenguas de Señas Argentinas, a través de una representación de animaciones tridimensionales. El objetivo principal fue construir una solución que puede ser implementada fácilmente dentro de cualquier proyecto de software existente en internet, para favorecer la adopción global progresiva y acompañar a la comunicación de manera síncrona, haciendo del entorno digital, un espacio más accesible y diverso.

The absence of specific mechanisms to facilitate the effective integration of the deaf population through their mother tongue (Argentine Sign Languages) becomes a severe constraint that leads to exclusion and a widening of the gap of inequalities in all areas in a transversal way. In digital spaces, there are no mass tools that respond to the specific needs of the deaf population, therefore, this situation leads to unequal access to content and restricted access to the digital environment. For this reason, in this project was developed a free software platform that receives audios from multiple sources and generate a simultaneous translation in Argentine Sign Languages, through a representation of three-dimensional animations. The main objective was to build a solution that can be easily implemented within any existing software project on the internet, to promote progressive global adoption and accompany communication in a synchronous manner, making the digital environment a more accessible and diverse space.

### Demo

La instancia actual de desarrollo nos permite contar con una demo que consta de la toma de audio desde el microfono y el reconocimiento de tres instrucciones: "Hola" "Si" "No".
El acceso se realiza a traves del siguiente enlace: 

https://lsaorg.github.io/impulsar/

Para poder continuar con el desarrollo es necesario:

-hardware de detección de movimientos (o bien modeladores 3D)
-Personas señantes que puedan ayudar a cargar nuevas señas




### Componentes

#### Servidor de Procesamiento y traducción (server)

Es el servicio principal del proyecto basado en WebSocket sobre NodeJS donde se nuclea la recepción de las transmisiones de audio de los clientes a las cuales vía diferentes vías de procesamiento. Esta información se transforma en distintas salidas:

- A texto en el lenguaje Español utilizando modelos de reconocimiento de voz del proyecto Google Speech Recognition.
- A animaciones representativas del lenguaje LSA utilizando una búsqueda heurística en una base de datos de clave-valor.

#### Librería Cliente (client)
Es la librería base del proyecto encargada de:
- Proveer la conectividad al servidor del proyecto.
- Establecer las interfaces necesarias para definir nuevas librerías que extiendan la
funcionalidad de la misma en forma de Plugins.
- Establecer los estándares y canales de comunicación hacia el servidor.
- Gestionar la inicialización de los plugins requeridos y la comunicación
bidireccional de estos con el servidor.

#### Librería de Captura de Sonido (plugin-record)
Este plugin utiliza las tecnología y estándares WebRTC para proporcionar el manejo de los permisos del navegador para acceder a los dispositivos de captura de sonido del hardware del cliente (por ejemplo, el micrófono), como así también la captura, codificación y transmisión del audio hacia la librería cliente.

#### Librería de Renderizado de Subtítulos (plugin-subtitle)
Este plugin hace uso de una manipulación directa del modelo de objetos del documento (DOM) del navegador web para renderizar en tiempo real los textos en español que son recibidos desde la librería cliente.

#### Librería de Renderizado de gráficos y animaciones 3D (plugin-webgl-render)
Este plugin hace uso de las tecnologías de WebGL para renderizar un modelo tridimensional de un intérprete que se anima en tiempo real en base a las animaciones que
son recibidas desde la librería cliente.
