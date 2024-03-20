export const getBoatColorClass = (boatNo: number): any => {
  return {
    "boat-color1": boatNo === 1,
    "boat-color2": boatNo === 2, 
    "boat-color3": boatNo === 3,
    "boat-color4": boatNo === 4,
    "boat-color5": boatNo === 5,
    "boat-color6": boatNo === 6
  }
}

export interface BoatColor {
  boatNo: number;
  backgroundColor: string;
  fontColor: string;
}

export const BoatColors = Object.freeze([
  //1号艇
  {
    boatNo: 1,
    backgroundColor: '#eeeeee',
    fontColor: '#111111'
  },
  //2号艇
  {
    boatNo: 2,
    backgroundColor: '#111111',
    fontColor: '#ffffff'
  },
  //3号艇
  {
    boatNo: 3,
    backgroundColor: '#d90000',
    fontColor: '#ffffff'
  },
  //4号艇
  {
    boatNo: 4,
    backgroundColor: '#2d5cff',
    fontColor: '#ffffff'
  },
  //5号艇
  {
    boatNo: 5,
    backgroundColor: '#ffdc00',
    fontColor: '#111111'
  },
  //6号艇
  {
    boatNo: 6,
    backgroundColor: '#2db200',
    fontColor: '#ffffff'
  }
]) as BoatColor[];