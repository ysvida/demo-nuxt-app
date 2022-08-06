<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          v-model="reqText"
          label="Front"
          clearable
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="resText"
          label="Server"
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          elevation="2"
          color="#455A64"
          @click="onClickSend"
        >
          Send Encrypted
        </v-btn>
        <v-btn
          elevation="2"
          color="#455A64"
          @click="onClickReceive"
        >
          Receive Encrypted
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CryptoPage',
  data () {
    return {
      reqText: '',
      resText: ''
    }
  },
  watch: {
    reqText (newVal) {
      this.resText = ''
    }
  },
  methods: {
    onClickSend () {
      const iv = this.$crypto.getIv()
      const encData = this.$crypto.encryptForServer(this.reqText, 'mySecretKey01234', iv)
      this.$axios.post('/api/v1/sample/crypto/encrypt-test', {
        message: encData,
        iv
      }).then((res) => {
        this.resText = res.data
      }).catch((err) => {
        // console.error(err.response)
        this.$dialog.error({
          text: err,
          title: 'Error'
        })
      })
    },
    onClickReceive () {
      const iv = this.$crypto.getIv()
      this.$axios.post('/api/v1/sample/crypto/decrypt-test', {
        message: this.reqText,
        iv
      }).then((res) => {
        const decData = this.$crypto.decryptForServer(res.data, 'mySecretKey01234', iv)
        if (decData && decData !== '') {
          this.resText = decData
        } else {
          this.$dialog.info({
            text: `Decryption fail. '${decData}'.`,
            title: 'Result'
          })
        }
      }).catch((err) => {
        // console.error(err.response)
        this.$dialog.error({
          text: err,
          title: 'Error'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
