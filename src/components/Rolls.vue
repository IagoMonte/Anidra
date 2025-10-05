<script setup>
import { reactive, ref, onMounted, watch, computed } from 'vue';
import MolduraCard from '@/components/MolduraCard.vue';
import OBR from "@owlbear-rodeo/sdk";
import CustomRoll from '@/components/customRoll.vue';
import { initializeApp } from "firebase/app"
import { getDatabase, ref as dbRef, set } from "firebase/database"

const props = defineProps({
  charData: { type: Object, required: true }, // aqui passa selectedChar.data.info.Stats
  charId: { type: String, required: true }, // id do item no Owlbear
  standAlone: { type: Boolean, required: false },
  charName: { type: Boolean, required: false }
})

const emit = defineEmits(['showNofication'])
const firebaseConfig = {
  apiKey: "AIzaSyCcfyq1sGmlsHw4PeyhZib9DD9Xk7eFXoM",
  authDomain: "anidra-backend.firebaseapp.com",
  databaseURL: "https://anidra-backend-default-rtdb.firebaseio.com",
  projectId: "anidra-backend",
}
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const canalAtual = ref("iagodtOwlbear1704")



const customNumDice = ref(2)
const customDiceSides = ref(6)
const customBonus = ref(0)

const mainAttributes = props.charData.stats.mainAttributes
const secondaryStats = props.charData.stats.secondaryStats
const proficiencies = props.charData.stats.proficiencies
const dons = props.charData.dons
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



async function getRollCount() {
  const token = localStorage.getItem("token")

  const response = await fetch('/api/rolls', {
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

  const response = await fetch('/api/rolls', {
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


function emitir(data) {
  const signalRef = dbRef(db, `broadcasts/${canalAtual.value}`)
  set(signalRef, { payload: data, ts: Date.now() })
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
    let msgShow = `${rollMessage.testLabel} de  ${props.charName}: [${rollMessage.rolls.join(",")}] + ${rollMessage.modi} + ${rollMessage.bonus} => ${rollMessage.total}`
    emit('showNofication', msgShow)
    emitir(msgShow)
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
    applyDons()
    try {
      await updateRollCount(rollcount)
    } catch (error) {
      console.error("Erro ao salvar rollcount:", error)
    }

    let msgShow = `${rollMessage.testLabel} de ${props.charName}: [${rollMessage.rolls.join(",")}] + ${rollMessage.modi} + ${rollMessage.bonus} => ${rollMessage.total}`
    emit('showNofication', msgShow)
    emitir(msgShow)
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


let basePercepçãoValue = Math.floor(parseInt(mainAttributes.Movimento.split('/')[0]) + (secondaryStats.Carisma / 2) + proficiencies.Percepção)//dons + Bonus
let basePersuasãoValue = Math.floor(secondaryStats.Carisma + proficiencies.Persuasão)//+dons + Bonus
let baseFurtividadeValue = Math.floor(secondaryStats.Carisma + proficiencies.Furtividade)// +dons + Bonus
let baseFurtividadeCombateValue = Math.floor(secondaryStats.Carisma + proficiencies.Furtividade_De_Combate)//dons + Bonus
let baseAcrobaciaValue = Math.floor(parseInt(mainAttributes.Movimento.split('/')[0]) + proficiencies.Acrobacia)//estamina opcional + dons + Bonus
let baseAcrobaciaCombateValue = Math.floor(0 + proficiencies.Acrobacia_De_Combate)//estamina opcional + dons + Bonus
let basePersistênciaValue = Math.floor(0 + proficiencies.Persistência)//dons + Bonus
let baseAtaqueValue = Math.floor(0 + proficiencies.Ataque)//dons  + Bonus
let baseDefesaValue = Math.floor(0 + proficiencies.Defesa)//dons  + Bonus
let basePrecisãoValue = Math.floor(0 + proficiencies.Precisão)//dons  + Bonus

let baseForçaValue = Math.floor(secondaryStats.Força)// + dons + Bonus
let baseCarismaValue = Math.floor(secondaryStats.Carisma)// + dons + Bonus
let baseSorteValue = Math.floor(secondaryStats.Sorte)// + dons + Bonus
let baseAuraValue = Math.floor(secondaryStats.Aura)// + dons + Bonus

let PercepçãoValue = ref(basePercepçãoValue)
let PersuasãoValue = ref(basePersuasãoValue)
let FurtividadeValue = ref(baseFurtividadeValue)
let FurtividadeCombateValue = ref(baseFurtividadeCombateValue)
let AcrobaciaValue = ref(baseAcrobaciaValue)
let AcrobaciaCombateValue = ref(baseAcrobaciaCombateValue)
let PersistênciaValue = ref(basePersistênciaValue)
let AtaqueValue = ref(baseAtaqueValue)
let DefesaValue = ref(baseDefesaValue)
let PrecisãoValue = ref(basePrecisãoValue)
let ForçaValue = ref(baseForçaValue)
let CarismaValue = ref(baseCarismaValue)
let SorteValue = ref(baseSorteValue)
let AuraValue = ref(baseAuraValue)


function applyDons() {
  console.log('to aplicando dom fdp')
  PercepçãoValue.value = basePercepçãoValue
  PersuasãoValue.value = basePersuasãoValue
  FurtividadeValue.value = baseFurtividadeValue
  FurtividadeCombateValue.value = baseFurtividadeCombateValue
  AcrobaciaValue.value = baseAcrobaciaValue
  AcrobaciaCombateValue.value = baseAcrobaciaCombateValue
  PersistênciaValue.value = basePersistênciaValue
  AtaqueValue.value = baseAtaqueValue
  DefesaValue.value = baseDefesaValue
  PrecisãoValue.value = basePrecisãoValue
  ForçaValue.value = baseForçaValue
  CarismaValue.value = baseCarismaValue
  SorteValue.value = baseSorteValue
  AuraValue.value = baseAuraValue

  switch (dons) {
    case "Talento":
      let totalRolls = 0
      Object.values(rollcount).forEach(element => {
        totalRolls = totalRolls + element
      });
      if (totalRolls % 2 != 0) {
        PercepçãoValue.value = Math.floor(PercepçãoValue.value + 1)
        PersuasãoValue.value = Math.floor(PersuasãoValue.value + 1)
        FurtividadeValue.value = Math.floor(FurtividadeValue.value + 1)
        FurtividadeCombateValue.value = Math.floor(FurtividadeCombateValue.value + 1)
        AcrobaciaValue.value = Math.floor(AcrobaciaValue.value + 1)
        AcrobaciaCombateValue.value = Math.floor(AcrobaciaCombateValue.value + 1)
        PersistênciaValue.value = Math.floor(PersistênciaValue.value + 1)
        AtaqueValue.value = Math.floor(AtaqueValue.value + 1)
        DefesaValue.value = Math.floor(DefesaValue.value + 1)
        PrecisãoValue.value = Math.floor(PrecisãoValue.value + 1)
        ForçaValue.value = Math.floor(ForçaValue.value + 1)
        CarismaValue.value = Math.floor(CarismaValue.value + 1)
        SorteValue.value = Math.floor(SorteValue.value + 1)
        AuraValue.value = Math.floor(AuraValue.value + 1)
      }
      break
    case "Atenção":
      PercepçãoValue.value = Math.floor(PercepçãoValue.value + 3)
      break
    case "Força":
      ForçaValue.value = Math.floor(ForçaValue.value + 2)
      break
    case "Sorte":
      if (rollcount['Sorte'] % 3 == 0) {
        SorteValue.value = Math.floor(SorteValue.value + 2)
      }
      break
    case "Esforço":
      PersistênciaValue.value = Math.floor(PersistênciaValue.value + 2)
      break
    case "Carisma":
      PersuasãoDices = PersuasãoDices + 1
      break
  }

}

const testes = computed(() => [
  { label: "Percepção", value: PercepçãoValue.value, Dices: PercepçãoDices, bonus: 0 },
  { label: "Persuasão", value: PersuasãoValue.value, Dices: PersuasãoDices, bonus: 0 },
  { label: "Furtividade", value: FurtividadeValue.value, Dices: FurtividadeDices, bonus: 0 },
  { label: "Furtividade de combate", value: FurtividadeCombateValue.value, Dices: FurtividadeCombateDices, bonus: 0 },
  { label: "Acrobacia", value: AcrobaciaValue.value, Dices: AcrobaciaDices, bonus: 0 },
  { label: "Acrobacia de combate", value: AcrobaciaCombateValue.value, Dices: AcrobaciaCombateDices, bonus: 0 },
  { label: "Persistência", value: PersistênciaValue.value, Dices: PersistênciaDices, bonus: 0 },
  { label: "Ataque", value: AtaqueValue.value, Dices: AtaqueDices, bonus: 0 },
  { label: "Defesa", value: DefesaValue.value, Dices: DefesaDices, bonus: 0 },
  { label: "Precisão", value: PrecisãoValue.value, Dices: PrecisãoDices, bonus: 0 }
])

const AtributosAtivos = computed(() => [
  { label: "Força", value: ForçaValue.value, Dices: ForçaDices, bonus: 0 },
  { label: "Carisma", value: CarismaValue.value, Dices: CarismaDices, bonus: 0 },
  { label: "Sorte", value: SorteValue.value, Dices: SorteDices, bonus: 0 },
  { label: "Aura", value: AuraValue.value, Dices: AuraDices, bonus: 0 }
])

onMounted(async () => {
  if (standAlone) {
    try {
      const savedRollCount = await getRollCount()
      if (savedRollCount) {
        Object.assign(rollcount, savedRollCount)
      }
      applyDons()
    } catch (error) {
      console.error("Erro ao carregar rollcount:", error)
    }
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