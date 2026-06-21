# 🌲 BioForesta Energía - Prototipo B2B
royecto desarrollado para BioForesta Energía por:

Pablo Tapia   
PDF

Gabriel Soto   
PDF

Salvador San Martín   
PDF

Valentina Risco   
PDF


Profesor Guía: Renato Cabrera   
PDF
[cite_start]Plataforma logística, ambiental y energética para coordinar retiro, acopio, clasificación y venta de biomasa forestal[cite: 3]. Este prototipo interactivo simula el flujo operativo entre generadores de biomasa y compradores industriales, integrando validación de stock y cálculo de mitigación de huella de carbono.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React 18
* **Build Tool:** Vite
* **Estilos:** Tailwind CSS
* **Navegación:** Renderizado condicional por estados (sin dependencias externas).

---

## ⚙️ Requisitos Previos

Para ejecutar este proyecto localmente, necesitas tener instalado en tu dispositivo:

* [Node.js](https://nodejs.org/) (versión 16 o superior recomendada).
* Git (para clonar el repositorio).

---

## 🚀 Instalación y Uso Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina:

## 🚀 Guía Paso a Paso para el Equipo (Instalación y Ejecución)

Para que cualquier miembro del equipo pueda levantar el proyecto localmente en su computador sin errores, sigan estos pasos exactos:

### Paso 1: Requisitos Previos
Asegúrense de tener instalado **Node.js** en sus equipos (es el motor que permite ejecutar el entorno de desarrollo). Si no lo tienen, descárguenlo gratuitamente desde [nodejs.org](https://nodejs.org/).

### Paso 2: Clonar el proyecto
Abran su terminal (o la consola integrada de VS Code) y descarguen el repositorio a su equipo:

```bash
git clone [https://github.com/pablotf16/Demo_BioForesta_App.git](https://github.com/pablotf16/Demo_BioForesta_App.git)

### Paso 3: Entrar a la carpeta del proyecto
Es vital navegar hacia la carpeta que acabamos de descargar antes de ejecutar cualquier otro comando. Escriban:

 cd Demo_BioForesta_App

### Paso 4: Instalar las dependencias
Este comando leerá la configuración del proyecto y descargará React, Vite, Tailwind CSS y todo lo necesario para que funcione. (Solo necesitan ejecutar esto la primera vez que clonan el proyecto):

npm install

### Paso 5: ¡Iniciar el servidor local!
Una vez que las dependencias terminen de instalarse, enciendan el servidor de desarrollo con este comando:

Bash
npm run dev

### Paso 6: Ver la aplicación
La terminal les mostrará un mensaje indicando que el servidor está corriendo junto con un enlace local (usualmente http://localhost:5173/).

Hagan Ctrl + Clic (o Cmd + Clic en Mac) sobre ese enlace para abrir el prototipo de BioForesta en su navegador predeterminado.

💡 Tip Operativo: Mientras la aplicación esté abierta en el navegador, la terminal debe permanecer abierta corriendo el servidor. Cuando terminen de trabajar y quieran apagar la plataforma, simplemente hagan clic en la terminal y presionen Ctrl + C.