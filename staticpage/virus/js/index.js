let doc = $(document), mX, mY = doc.height()/1.5, fX = doc.width()/2, mouse = false, letter = []
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!@#$%^&*~`/.,<>?\|]}{[".split("")

mR = (n, i) => Math.floor(Math.random() * n) + i

inject = () => { 
  $("body").append("<canvas></canvas>")
  can = document.querySelector("canvas")
  con = can.getContext("2d")
  init()
}

size = () => {
  can.height = doc.height()
  can.width = doc.width()
}

$(window).on("resize", () => { size() })

init = () => {
  size()
  think()
}

doc.on("mousemove", (e) => {
  mX = e.pageX
  mY = e.pageY
  mouse = true
})

dT = (x, y, t, s, c) => {
  con.save()
  con.font = ""+s+"px Lucida Console"
  con.shadowColor = "rgba(255,0,0,"+c+")"
  con.shadowBlur = s/2
  con.fillStyle = "rgba(255,0,0,"+c+")"
  let tW = con.measureText(t).width
  con.fillText(t, x-tW/2, y)
  con.restore()
}

dR = (x, y, w, h, c) => {
  con.save()
  con.beginPath()
  con.rect(x, y, w, h)
  con.fillStyle = c
  con.fill()
  con.restore()
}

think = () => {
  let sC = mR(2, 1)
  fX <= doc.width()/2 + 200 && mouse == false ? fX++: mouse == false ? fX = doc.width()/2 - 200: fX = mX
  sC == 1 || sC == 3 ? letter.push([fX-10+mR(20, 0), mY+mR(20,0), letters[mR(letters.length, 0)], mR(10, 8), 1, mR(6, 1) + Math.random(10)/10, mR(20, 0)]): null
  for (let i = 0; i < letter.length; i++) {
    sC == 2 ? letter ? letter[i][2] = letters[mR(letters.length, 0)]: null:null
    letter ? letter[i][1]-= letter[i][5]: null
    letter[i][4] >= 0 ? letter[i][4]-= 0.01: letter.splice(i, 1)
  }
  animate()
  mouse == true ? mouse = false: null
  window.requestAnimationFrame(think)
}

animate = () => {
  con.clearRect(0, 0, can.width, can.height)
  for (let i = 0; i < letter.length; i++) {
    dT(letter[i][0], letter[i][1], letter[i][2], letter[i][3], letter[i][4])
    let rH = mR(540, 10)
    let sH = mR(rH, 1)
    letter[i][6] == 2 ? dR(letter[i][0], letter[i][1]-sH, letter[i][3]/1.5, rH, "rgba(255, 0, 0, 0.05)"): null
  }
}

doc.ready(() => inject())