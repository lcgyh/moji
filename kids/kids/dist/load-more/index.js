Component({
    externalClasses: ['i-class'],

    properties: {
        loading: {
            type: Boolean,
            value: true
        },
        tip: {
            type: String,
            value: ''
        }
    },

  methods: {
    handleClick() {
      this.triggerEvent('handleClick');
    },
  }
});
