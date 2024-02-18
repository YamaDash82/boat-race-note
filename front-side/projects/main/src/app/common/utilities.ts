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

