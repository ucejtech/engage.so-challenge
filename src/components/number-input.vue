<template>
  <div class="quantity d-flex">
    <button
      class="quantity-button quantity-down d-flex align-center justify-center number-control" @click="() => value--"
      :disabled="value <= 1"
    >
      -
    </button>
    <input type="number" min="1" max="7" step="1" v-model="value" value="1" disabled/>
    <button
      class="quantity-button quantity-up d-flex align-center justify-center number-control" @click="() => value++"
      :disabled="value >= 7"
    >
      +
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({
    value: '3'
  }),
  mounted () {
    this.$emit('data', this.value)
  },
  watch: {
    value (newValue, oldValue) {
      this.$emit('data', newValue)
    }
  }
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  width: 36px;
  height: 25px;
  border: 1px solid var(--color-border);
}
.quantity {
    width: fit-content;
}
.quantity .number-control {
  width: 24px;
  border: 1px solid var(--color-border);
  cursor: pointer;
}
.quantity .number-control:hover {
    background: rgb(245, 242, 242);
}

input[type="number"]:focus {
    outline: none;
}
.quantity:focus-within {
    outline: #6d6a6a auto 1px;
}
</style>
