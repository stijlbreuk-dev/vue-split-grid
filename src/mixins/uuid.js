export default {
  beforeCreate() {
    this.uuid = String(Math.random()).split('.').join('');
  }
};
