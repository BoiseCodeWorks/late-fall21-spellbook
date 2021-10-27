export class Spell {
  constructor(data) {
    this.id = data.id || ''
    this.index = data.index || ''
    this.name = data.name
    this.range = data.range
    this.components = data.components
    this.duration = data.duration
    this.level = data.level
    this.prepared = data.prepared || false
    // NOTE the Adapter pattern at work
    this.description = data.description || data.desc?.join('\n\n')
  }

  get Template() {
    return `
    <div class="w-75 bg-white elevation-1 p-3 d-flex flex-column">
      <div class="text-center">
        <h3>${this.name}</h3>
        <p><b>Range:</b> ${this.range} | <b>Duration:</b> ${this.duration} | <b>Level:</b> ${this.level}</p>
        <p><b>Components:</b> ${this.components.join(', ')}</p>
      </div>
      <p>${this.description}</p>
      <div class="d-flex justify-content-between justify-self-end mt-auto">
        <div>
        ${this.Checkbox}
        </div>
        ${this.Button}
      </div>
    </div>
  `
  }

  get Checkbox() {
    if (!this.id) {
      return ''
    }
    // REVIEW adding the property if the bool is true
    return `        
      <input type="checkbox" ${this.prepared ? 'checked' : ''} name="prepared" id="prepared" onclick="app.spellsController.prepare()">
      <label for="prepared">Prepared</label>`
  }

  get Button() {
    if (this.index) {
      return '<button class="btn btn-success" onclick="app.spellsController.addSpell()">add</button>'
    }
    // REVIEW adding the property if the bool is true
    return `<button class="btn btn-danger" onclick="app.spellsController.removeSpell()">remove</button>`
  }

}