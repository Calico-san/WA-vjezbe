<template>
  <div
    class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- grid-cols-1 (zadano - mobiteli), sm:grid-cols-2 (tableti), lg:grid-cols-3(laptopi, monitori) -->
      <!-- Pizze v-for -->
      <div
        v-for="pizza in pizze"
        :key="pizza.naziv"
        :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
          odabrana_pizza === pizza.naziv
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]"
        @click="odaberiPizzu(pizza.naziv)"
      >
        <div class="w-full h-48 flex items-center justify-center bg-inherit">
          <img
            src="https://www.freeiconspng.com/uploads/pizza-png-1.png"
            alt="Pizza Image 1"
            class="w-full h-full object-contain"
          />
        </div>

        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <h2
              :class="[
                'text-lg font-bold tracking-wide',
                odabrana_pizza == pizza.naziv ? 'text-black' : 'text-orange-500',
              ]"
            >
              {{ pizza.naziv }}
              <!-- interpolacija -->
            </h2>

            <div class="flex space-x-2">
              <div
                v-for="sastojak in pizza.sastojci"
                :key="sastojak"
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs"
              >
                <v-icon :name="ikoneSastojaka[sastojak]"></v-icon>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="(cijena, velicina) in pizza.cijene"
              class="flex justify-between text-gray-700"
            >
              <!-- v-for="(value, key) in objekt" -->
              <span class="font-medium">{{
                velicina.charAt(0).toUpperCase() + velicina.slice(1)
              }}</span>
              <!-- prvo veliko slovo naziva pizze -->
              <span>€{{ cijena }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { addIcons } from 'oh-vue-icons'
// uvoz potrebnih ikona
import {
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  CoHotjar,
  GiMilkCarton,
  GiBellPepper,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  GiHamShank,
} from 'oh-vue-icons/icons'

// registracija ikona koje ćemo koristiti
addIcons(
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  GiBellPepper,
  GiHamShank,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  CoHotjar,
  GiMilkCarton,
)

import { onMounted, ref } from 'vue'
import axios from 'axios'

const URL_express = 'http://localhost:3000'

const odabrana_pizza = ref(null) // reaktivna varijabla za pohranu naziva odabrane pizze
let pizze = ref([])

// mapa ikona sastojaka s kebab-case imenima
const ikoneSastojaka = {
  rajčica: 'gi-tomato',
  sir: 'gi-cheese-wedge',
  gljive: 'gi-sliced-mushroom',
  bosiljak: 'io-leaf-sharp',
  paprika: 'gi-bell-pepper',
  šunka: 'gi-ham-shank',
  'feferoni ljuti': 'la-pepper-hot-solid',
  tunjevina: 'gi-canned-fish',
  'crveni luk': 'gi-garlic',
  panceta: 'fa-bacon',
  kulen: 'co-hotjar',
  vrhnje: 'gi-milk-carton',
}

function odaberiPizzu(pizza_naziv) {
  odabrana_pizza.value = pizza_naziv // postavljanje naziva odabrane pizze
  console.log('Odabrana pizza:', odabrana_pizza.value) // ispis u konzolu (provjerite)
}

async function dohvati_pizze() {
  try {
    let response = await axios.get(`${URL_express}/pizze`)
    pizze.value = response.data
    console.log(`Dohvaćene pizze s backenda: ${pizze.value.map((pizza_obj) => pizza_obj.naziv)}`)
  } catch (error) {
    console.error(`Greška: ${error}`)
  }
}

onMounted(() => {
  dohvati_pizze()
})
</script>
