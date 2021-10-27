import { ProxyState } from "../AppState.js"
import { Spell } from "../Models/Spell.js"
import { dndApi, sandboxApi } from "./AxiosService.js"

class SpellsService {

  async getDndApiSpells() {
    const res = await dndApi.get('')
    ProxyState.dndApiSpells = res.data.results
  }

  async getMySpells() {
    const res = await sandboxApi.get('')
    console.log(res.data)
    const spells = res.data.map(s => new Spell(s))
    ProxyState.mySpells = spells
  }

  async getDndApiSpellByIndex(index) {
    const res = await dndApi.get(index)
    // REVIEW when working with single objects there is no need for map
    const spell = new Spell(res.data)
    ProxyState.activeSpell = spell
  }


  async addSpell() {
    // do I already have this spell (name)
    const found = ProxyState.mySpells.find(s => s.name == ProxyState.activeSpell.name)
    if (found) {
      throw new Error('You already have that spell')
    }


    const res = await sandboxApi.post('', ProxyState.activeSpell)
    const spell = new Spell(res.data)
    ProxyState.mySpells = [...ProxyState.mySpells, spell]
    // sets the one from my spell book as the active one instead of the current dndApi spell
    this.setActive(spell.id)
  }

  setActive(id) {
    const spell = ProxyState.mySpells.find(s => s.id == id)
    ProxyState.activeSpell = spell
  }

  async removeSpell() {
    await sandboxApi.delete(ProxyState.activeSpell.id)
    ProxyState.mySpells = ProxyState.mySpells.filter(s => s.id != ProxyState.activeSpell.id)
    ProxyState.activeSpell = null
  }

  async prepare() {
    const spell = ProxyState.activeSpell
    // REVIEW the ! symbol changes true to false and false to true
    spell.prepared = !spell.prepared
    const res = await sandboxApi.put(spell.id, spell)
    ProxyState.mySpells = ProxyState.mySpells

  }

}

export const spellsService = new SpellsService()