<script setup>
import MolduraCard from './MolduraCard.vue';
const props = defineProps({
  charData: { type: Object, required: true }, // aqui passa selectedChar.data.info.Stats
  charId: { type: String, required: true } // id do item no Owlbear
})

const mainAttributes = props.charData.stats.mainAttributes
const secondaryStats = props.charData.stats.secondaryStats
const proficiencies = props.charData.stats.proficiencies
const dons = props.charData.dons

function RollD6() {
  let min = Math.ceil(1);
  let max = Math.floor(6);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rollTeste(rolls,modi){
  let reuslts = []
  for(let i=0;i<rolls;i++){
    reuslts.push(RollD6())
  }
  let res = 0
  reuslts.forEach((a,i)=>{
    res = res+a
  })

  console.log(reuslts, '=', res, '+', modi)
}
let PercepçãoDices = 2
let PersuasãoDices = 2
let FurtividadeDices = 2
let FurtividadeCombateDices = 2
let AcrobaciaDices = 2
let AcrobaciaCombateDices = 2
let PersistênciaDices = 2
let AtaqueDices = 2
let DefesaDices = 2
let PrecisãoDices = 2
let ForçaDices = 2
let CarismaDices = 2
let SorteDices = 2
let AuraDices = 2


let PercepçãoValue = Math.floor(parseInt(mainAttributes.Movimento.split('/')[0]) + (secondaryStats.Carisma/2) + proficiencies.Percepção)//dons + Bonus
let PersuasãoValue = Math.floor(secondaryStats.Carisma + proficiencies.Persuasão)//+dons + Bonus
let FurtividadeValue = Math.floor(secondaryStats.Carisma+ proficiencies.Furtividade)// +dons + Bonus
let FurtividadeCombateValue = Math.floor(secondaryStats.Carisma + proficiencies.Furtividade_De_Combate)//dons + Bonus
let AcrobaciaValue = Math.floor(parseInt(mainAttributes.Movimento.split('/')[0]) + proficiencies.Acrobacia)//estamina opcional + dons + Bonus
let AcrobaciaCombateValue =Math.floor(0 + proficiencies.Acrobacia_De_Combate)//estamina opcional + dons + Bonus
let PersistênciaValue = Math.floor(0 + proficiencies.Persistência)//dons + Bonus
let AtaqueValue = Math.floor(0 + proficiencies.Ataque)//dons  + Bonus
let DefesaValue = Math.floor(0 + proficiencies.Defesa)//dons  + Bonus
let PrecisãoValue = Math.floor(0 + proficiencies.Precisão)//dons  + Bonus


let ForçaValue = Math.floor(secondaryStats.Força)// + dons + Bonus
let CarismaValue = Math.floor(secondaryStats.Carisma)// + dons + Bonus
let SorteValue = Math.floor(secondaryStats.Sorte)// + dons + Bonus
let AuraValue = Math.floor(secondaryStats.Aura)// + dons + Bonus


switch(dons){
  case "Talento":
    // atribuir rollcount ao playerid
    break
  case "Atenção":
    PercepçãoValue = Math.floor(PercepçãoValue + 3)
    break
  case "Força":
    ForçaValue = Math.floor(ForçaValue + 2)
    break
  case "Sorte":
    // atribuir rollcount ao playerid
    break
  case "Esforço":
    PersistênciaValue = Math.floor(PersistênciaValue + 2)
    break
  case "Carisma":
    PersuasãoDices = PersuasãoDices + 1
    break
}


const testes = [
  { label: "Percepção", value: PercepçãoValue, Dices: PercepçãoDices},
  { label: "Persuasão", value: PersuasãoValue, Dices: PersuasãoDices},
  { label: "Furtividade", value: FurtividadeValue, Dices: FurtividadeDices},
  { label: "Furtividade de combate", value: FurtividadeCombateValue, Dices: FurtividadeCombateDices},
  { label: "Acrobacia", value: AcrobaciaValue, Dices: AcrobaciaDices},
  { label: "Acrobacia de combate", value: AcrobaciaCombateValue, Dices: AcrobaciaCombateDices},
  { label: "Persistência", value: PersistênciaValue, Dices: PersistênciaDices},
  { label: "Ataque", value: AtaqueValue, Dices: AtaqueDices},
  { label: "Defesa", value: DefesaValue, Dices: DefesaDices},
  { label: "Precisão", value: PrecisãoValue, Dices: PrecisãoDices}
]

const AtributosAtivos = [
  { label: "Força", value: ForçaValue, Dices: ForçaDices},
  { label: "Carisma", value: CarismaValue, Dices: CarismaDices},
  { label: "Sorte", value: SorteValue, Dices: SorteDices},
  { label: "Aura", value: AuraValue, Dices: AuraDices}
]
</script>

<template>
  <main class="bg-[#121212] text-white min-h-screen p-4">
    <h1 class="text-3xl font-semibold mb-3 border-b border-gray-700 pb-2">
      Testes
    </h1>

    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
      <MolduraCard
        v-for="(t, i) in testes"
        :key="i"
        :label="t.label"
        :value="(t.Dices+'d6+'+t.value)"
        @click="rollTeste(t.Dices,t.value)"
      />
    </div>
    <h1 class="text-3xl font-semibold mb-3 border-b border-gray-700 pb-2">
      Atributos Ativos
    </h1>

    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
      <MolduraCard
        v-for="(t, i) in AtributosAtivos"
        :key="i"
        :label="t.label"
        :value="(t.Dices+'d6+'+t.value)"
        @click="rollTeste(t.Dices,t.value)"
      />
    </div>
  </main>
</template>