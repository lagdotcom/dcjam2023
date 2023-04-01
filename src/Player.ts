export default class Player {
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;

  constructor(public name: string) {
    this.maxHp = 10;
    this.hp = this.maxHp;
    this.maxSp = 10;
    this.sp = this.maxSp;
  }
}
