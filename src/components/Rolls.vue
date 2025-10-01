<script setup>
import { reactive, ref } from 'vue';
import MolduraCard from '@/components/MolduraCard.vue';
import OBR from "@owlbear-rodeo/sdk";
import CustomRoll from '@/components/customRoll.vue';

const props = defineProps({
  charData: { type: Object, required: true }, // aqui passa selectedChar.data.info.Stats
  charId: { type: String, required: true }, // id do item no Owlbear
  standAlone: { type: Boolean, required: false }
})

const emit = defineEmits(['showNofication'])

const customNumDice = ref(2)
const customDiceSides = ref(6)
const customBonus = ref(0)

const mainAttributes = props.charData.stats.mainAttributes
const secondaryStats = props.charData.stats.secondaryStats
const proficiencies = props.charData.stats.proficiencies
const dons = props.charData.dons

async function getRollCount() {
  const token = localStorage.getItem("token")

  const response = await fetch('/rolls', {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) throw new Error("Erro ao buscar rollcount")

  const data = await response.json()
  return data.rolls_count
}

async function updateRollCount(newRollsCount) {
  const token = localStorage.getItem("token")

  const response = await fetch('/rolls', {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ newRollsCount })
  })

  if (!response.ok) throw new Error("Erro ao atualizar rollcount")

  const data = await response.json()
  return data.rolls_count
}

async function CRoll(dices, faces, bonus) {
  let min = Math.ceil(1)
  let max = Math.floor(faces)
  let results = []
  for (let i = 0; i < dices; i++) {
    results.push(Math.floor(Math.random() * (max - min + 1)) + min)
  }

  let sum = results.reduce((a, b) => a + b, 0)
  let finalResult = Math.floor(sum + bonus)

  let rollMessage = {
    type: "ROLL_RESULT",
    playerId: props.charId, // quem rolou
    testLabel: 'Rolagem Personalizada',
    rolls: results,
    modi: 0,
    bonus,
    total: finalResult,
  }

  if (props.standAlone) {
    let msgShow = `${rollMessage.testLabel}: [${rollMessage.rolls.join(",")}] + ${rollMessage.modi} + ${rollMessage.bonus} => ${rollMessage.total}`
    emit('showNofication', msgShow)
  } else {
    await OBR.broadcast.sendMessage("Roll_Result", rollMessage, { destination: "ALL" })

  }
}

function RollD6() {
  let min = Math.ceil(1);
  let max = Math.floor(6);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function rollTeste(label, rolls, modi, bonus) {
  let results = [];
  for (let i = 0; i < rolls; i++) {
    results.push(RollD6());
  }

  let sum = results.reduce((a, b) => a + b, 0);
  let finalResult = sum + modi + bonus;

  let rollMessage = {
    type: "ROLL_RESULT",
    playerId: props.charId, // quem rolou
    testLabel: label,
    rolls: results,
    modi,
    bonus,
    total: finalResult,
  }

  if (props.standAlone) {

    rollcount[label]++
    try {
      await updateRollCount(rollcount)
    } catch (error) {
      console.error("Erro ao salvar rollcount:", error)
    }
    
    let msgShow = `${rollMessage.testLabel}: [${rollMessage.rolls.join(",")}] + ${rollMessage.modi} + ${rollMessage.bonus} => ${rollMessage.total}`
    emit('showNofication', msgShow)
  } else {
    await OBR.broadcast.sendMessage("Roll_Result", rollMessage, { destination: "ALL" })

  }

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


let PercepçãoValue = Math.floor(parseInt(mainAttributes.Movimento.split('/')[0]) + (secondaryStats.Carisma / 2) + proficiencies.Percepção)//dons + Bonus
let PersuasãoValue = Math.floor(secondaryStats.Carisma + proficiencies.Persuasão)//+dons + Bonus
let FurtividadeValue = Math.floor(secondaryStats.Carisma + proficiencies.Furtividade)// +dons + Bonus
let FurtividadeCombateValue = Math.floor(secondaryStats.Carisma + proficiencies.Furtividade_De_Combate)//dons + Bonus
let AcrobaciaValue = Math.floor(parseInt(mainAttributes.Movimento.split('/')[0]) + proficiencies.Acrobacia)//estamina opcional + dons + Bonus
let AcrobaciaCombateValue = Math.floor(0 + proficiencies.Acrobacia_De_Combate)//estamina opcional + dons + Bonus
let PersistênciaValue = Math.floor(0 + proficiencies.Persistência)//dons + Bonus
let AtaqueValue = Math.floor(0 + proficiencies.Ataque)//dons  + Bonus
let DefesaValue = Math.floor(0 + proficiencies.Defesa)//dons  + Bonus
let PrecisãoValue = Math.floor(0 + proficiencies.Precisão)//dons  + Bonus


let ForçaValue = Math.floor(secondaryStats.Força)// + dons + Bonus
let CarismaValue = Math.floor(secondaryStats.Carisma)// + dons + Bonus
let SorteValue = Math.floor(secondaryStats.Sorte)// + dons + Bonus
let AuraValue = Math.floor(secondaryStats.Aura)// + dons + Bonus


switch (dons) {
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


const testes = reactive([
  { label: "Percepção", value: PercepçãoValue, Dices: PercepçãoDices, bonus: 0 },
  { label: "Persuasão", value: PersuasãoValue, Dices: PersuasãoDices, bonus: 0 },
  { label: "Furtividade", value: FurtividadeValue, Dices: FurtividadeDices, bonus: 0 },
  { label: "Furtividade de combate", value: FurtividadeCombateValue, Dices: FurtividadeCombateDices, bonus: 0 },
  { label: "Acrobacia", value: AcrobaciaValue, Dices: AcrobaciaDices, bonus: 0 },
  { label: "Acrobacia de combate", value: AcrobaciaCombateValue, Dices: AcrobaciaCombateDices, bonus: 0 },
  { label: "Persistência", value: PersistênciaValue, Dices: PersistênciaDices, bonus: 0 },
  { label: "Ataque", value: AtaqueValue, Dices: AtaqueDices, bonus: 0 },
  { label: "Defesa", value: DefesaValue, Dices: DefesaDices, bonus: 0 },
  { label: "Precisão", value: PrecisãoValue, Dices: PrecisãoDices, bonus: 0 }
])

const AtributosAtivos = reactive([
  { label: "Força", value: ForçaValue, Dices: ForçaDices, bonus: 0 },
  { label: "Carisma", value: CarismaValue, Dices: CarismaDices, bonus: 0 },
  { label: "Sorte", value: SorteValue, Dices: SorteDices, bonus: 0 },
  { label: "Aura", value: AuraValue, Dices: AuraDices, bonus: 0 }
])

const rollcount = reactive({
  "Aura": 0,
  "Sorte": 0,
  "Ataque": 0,
  "Defesa": 0,
  "Força": 0,
  "Carisma": 0,
  "Acrobacia": 0,
  "Precisão": 0,
  "Persuasão": 0,
  "Furtividade": 0,
  "Percepção": 0,
  "Persistência": 0,
  "Acrobacia de combate": 0,
  "Furtividade de combate": 0
})

onMounted(async () => {
  try {
    const savedRollCount = await getRollCount()
    if (savedRollCount) {
      Object.assign(rollcount, savedRollCount)
    }
  } catch (error) {
    console.error("Erro ao carregar rollcount:", error)
  }
})

</script>
<template>
  <main class="bg-[#121212] text-white min-h-screen p-2 sm:p-0">
    <!-- Título Testes -->
    <h1 class="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3 border-b border-gray-700 pb-1 sm:pb-2">
      Testes
    </h1>

    <!-- Grid de Testes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 justify-items-center gap-2 sm:gap-4">
      <MolduraCard v-for="(t, i) in testes" :key="i" class="w-full max-w-[300px]" :label="t.label"
        :value="t.Dices + 'd6+' + t.value" v-model:bonus="t.bonus"
        @click="rollTeste(t.label, t.Dices, t.value, t.bonus)" />
    </div>

    <!-- Título Atributos Ativos -->
    <h1 class="text-2xl sm:text-3xl font-semibold mt-6 mb-2 sm:mb-3 border-b border-gray-700 pb-1 sm:pb-2">
      Atributos Ativos
    </h1>

    <!-- Grid de Atributos Ativos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 justify-items-center gap-2 sm:gap-4">
      <MolduraCard v-for="(t, i) in AtributosAtivos" :key="i" class="w-full max-w-[300px]" :label="t.label"
        :value="t.Dices + 'd6+' + t.value" v-model:bonus="t.bonus"
        @click="rollTeste(t.label, t.Dices, t.value, t.bonus)" />
    </div>
    <h1 class="text-2xl sm:text-3xl font-semibold mt-6 mb-2 sm:mb-3 border-b border-gray-700 pb-1 sm:pb-2">
      Dados Personalizados
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 justify-items-center gap-2 sm:gap-4">
      <CustomRoll :label="'Rolagem personalizada'" v-model:CustomBonus="customBonus"
        v-model:CustomSides="customDiceSides" v-model:CustomNumDice="customNumDice"
        @click="CRoll(customNumDice, customDiceSides, customBonus)" />
    </div>
  </main>
</template>