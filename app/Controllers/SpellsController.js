import { ProxyState } from "../AppState.js"
import { spellsService } from "../Services/SpellsService.js"

function _drawDndApiSpells() {
  const spells = ProxyState.dndApiSpells
  let template = ''
  spells.forEach(s => template += `<p class="m-1 selectable" onclick="app.spellsController.getDndApiSpellByIndex('${s.index}')">${s.name}</p>`)
  document.getElementById('dnd-spells').innerHTML = template
}

function _drawMySpells() {
  const spells = ProxyState.mySpells
  let template = ''
  // REVIEW creates a new array of all the 'prepared' spells and gets is length (count)
  let preparedSpells = spells.filter(s => s.prepared).length
  spells.forEach(s => template += `
  <p class="m-1 selectable" onclick="app.spellsController.setActive('${s.id}')">
    ${s.name} ${s.prepared ? '<i class="text-info mdi mdi-book"></i>' : ''}
  </p>
  `)
  // render if there are no spells
  if (!template) {
    template = '<p class="text-grey darken-20">No Spells</p>'
  }
  template = `<h4 class="text-info"> ${preparedSpells} / ${spells.length}</h4>` + template
  document.getElementById('my-spells').innerHTML = template
}

function _drawActiveSpell() {
  // REVIEW no need to iterate we are only drawing one element
  let template = ''
  // allows active spell to be cleared
  if (ProxyState.activeSpell) {
    template = ProxyState.activeSpell.Template
  }
  document.getElementById('active-spell').innerHTML = template
}

// NOTE Cool way to show errors to user without 'window.alert'
function toast(message, type, time = 2000) {
  // @ts-ignore
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: time,
    timerProgressBar: true
  })

  Toast.fire({
    icon: type,
    title: message
  })
}


export class SpellsController {
  constructor() {
    this.getDndApiSpells()
    this.getMySpells()


    ProxyState.on('dndApiSpells', _drawDndApiSpells)
    ProxyState.on('mySpells', _drawMySpells)
    ProxyState.on('activeSpell', _drawActiveSpell)
  }
  async getMySpells() {
    try {
      await spellsService.getMySpells()
    } catch (error) {
      toast(error.message, 'error')
      console.error("[Sandbox API Error]", error)
    }
  }
  async getDndApiSpells() {
    try {
      await spellsService.getDndApiSpells()
    } catch (error) {
      toast(error.message, 'error')
      console.error("[DND API Error]", error)
    }
  }

  async getDndApiSpellByIndex(index) {
    try {
      await spellsService.getDndApiSpellByIndex(index)
    } catch (error) {
      toast(error.message, 'error')
      console.error("[DND API Error]", error)
    }
  }

  async addSpell() {
    try {
      await spellsService.addSpell()
      toast('Added Spell', 'success')
    } catch (error) {
      toast(error.message, 'error')
    }
  }

  setActive(id) {
    spellsService.setActive(id)
  }

  async removeSpell() {
    try {
      await spellsService.removeSpell()
      toast('Removed Spell', 'success')
    } catch (error) {
      console.error("[Sandbox API Error]", error.message)
    }
  }

  async prepare() {
    try {
      await spellsService.prepare()
    } catch (error) {
      console.error("[Sandbox API Error]", error.message)
    }
  }
}