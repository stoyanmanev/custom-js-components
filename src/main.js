const hour = "08:49:14";

class Input {
  constructor(obj) {
    this.type = obj.type;
    this.name = obj.name;
    this.value = obj.value;
    this.max = obj.max;
    this.min = obj.min;
    this.step = obj.step;
    this.dataset = obj.dataset;
  }
  makeInput() {
    const input = document.createElement("input");
    input.name = this.name;
    input.type = this.type;
    input.value = this.value;
    input.max = this.max;
    input.min = this.min;
    input.step = this.step;
    input.dataset.event = this.dataset;
    return input;
  }
  get render() {
    return this.makeInput();
  }
}

class Badge {
  constructor(obj) {
    this.name = obj.name;
    this.dataset = obj.dataset;
  }
  makeBadge() {
    const span = document.createElement("span");
    span.classList.add("badge");
    span.innerText = "00:00";
    span.dataset.type = this.dataset;
    return span;
  }

  get render() {
    return this.makeBadge();
  }
}

function main(hour) {
  const app = document.getElementById("app");

  const map = {
    change: changeBadgeValue,
  };

  const input = new Input({
    type: "range",
    name: "range-01",
    max: getMaxValueRange(hour),
    min: 0,
    step: 5,
    value: 0,
    dataset: "change",
  });
  const badge = new Badge({ name: "test", dataset: "badge" });
  const div = document.createElement("div");
  const listAppend = [input.render, badge.render];

  function handleChange(e) {
    if (typeof map[e.target.dataset.event] === "function") {
      map[e.target.dataset.event](e);
    }
  }

  function changeBadgeValue(e) {
    const parent = e.target.parentElement;
    const children = parent.children;

    const badge = Object.values(children).filter(
      (x) => x.dataset.type && x.dataset.type
    );

    function converValue(value, badge) {
      let hours = 0;
      let minutes = 0;

      for (let x = value; x >= 60; x -= 60) {
        hours++;
      }

      minutes = value - hours * 60;

      hours < 10 ? (hours = `0${hours}`) : `${hours}`;
      minutes < 10 ? (minutes = `0${minutes}`) : `${minutes}`;

      const v = `${hours}:${minutes}`;

      setValue(badge, v);
    }

    function setValue(arr, value) {
      Object.values(arr).forEach((x) => (x.innerText = value));
    }

    converValue(e.target.value, badge);
  }

  function getMaxValueRange(h) {
    const stime = convertSTime(h);
    const ntime = getTimeNow();

    function convertSTime(h) {
      const arr = h.split(":");
      arr.pop();
      return arr.join(":");
    }

    function getTimeNow() {
      const date = new Date();
      const hour = date.getHours();
      const minutes = date.getMinutes();

      return `${hour}:${minutes}`;
    }

    function mathValue(s, n) {
      const sDes = s.split(":");
      const nDes = n.split(":");
      let minutes = 0;
      let hour = 0;

      parseInt(nDes[1]) > parseInt(sDes[1])
        ? (minutes = parseInt(nDes[1]) - parseInt(sDes[1]))
        : (minutes = parseInt(nDes[1]) + 60 - parseInt(sDes[1]));
      parseInt(nDes[1]) > parseInt(sDes[1])
        ? (hour = parseInt(nDes[0]) - parseInt(sDes[0]))
        : (hour = parseInt(nDes[0] - 1) - parseInt(sDes[0]));

      minutes < 10 ? minutes = `0${minutes}` : minutes = `${minutes}`;
      hour < 10 ? hour = `0${hour}` : hour =  `${hour}`;

      return `${hour}:${minutes}`
    }

    const time = mathValue(stime, ntime);
    
    const res = converTtoR(time)

    function converTtoR(t){
        const h = t.split(":")[0]
        const m = t.split(":")[1]

        return parseInt(h) * 60 + parseInt(m);
    }

    return res;
  }

  listAppend.forEach((x) => div.appendChild(x));
  app.appendChild(div);
  app.addEventListener("change", handleChange);
}

window.addEventListener("load", () => {
  main(hour);
});
