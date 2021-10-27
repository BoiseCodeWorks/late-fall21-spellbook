import { SpellsController } from "./Controllers/SpellsController.js"


class App {
  spellsController = new SpellsController()
}

window["app"] = new App()
