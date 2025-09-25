 Aprendiendo Git y GitHub

Este repositorio documenta mi proceso de aprendizaje con Git y GitHub, herramientas fundamentales para el control de versiones y la colaboración en proyectos de software.

 ¿Qué he aprendido?

Inicializar un repositorio Git
- Usar `git init` para iniciar el control de versiones en una carpeta local.
- Entender cómo Git rastrea los cambios en archivos.

 Seguimiento de cambios
- Comandos esenciales:
  - `git add .` para agregar todos los cambios al área de preparación.
  - `git commit -m "mensaje"` para registrar los cambios con un mensaje descriptivo.
  - `git status` para verificar el estado del repositorio.

Subir a GitHub
- Crear un repositorio en [GitHub.com](https://github.com).
- Conectar el repositorio local con GitHub usando:
  ```bash
  git remote add origin https://github.com/usuario/repositorio.git
  git push -u origin main
