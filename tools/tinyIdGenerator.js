const getRandomArrPool = (simpleArrPool) => {
  for (let index = simpleArrPool.length - 1; index > 0; index--) {
    let randomIndex = Math.floor(Math.random() * (index + 1))
      ;[simpleArrPool[index], simpleArrPool[randomIndex]] = [simpleArrPool[randomIndex], simpleArrPool[index]]
  }
  return simpleArrPool
}

// sample a element from pool
const sample = (randomArrPool) => {
  let randomIndex = Math.floor(Math.random() * randomArrPool.length)
  return randomArrPool[randomIndex]
}
const getTinyId = (randomArrPool) => {
  let tinyId = ''
  for (let i = 1; i <= 5; i++) {
    tinyId += sample(randomArrPool)
  }
  return tinyId
}

const tinyIdGenerator = () => {
  // define elements tiny ID will use
  const elements = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  // create a pool to store elements 
  let pool = (elements.split(''))
  // get randomly displayed pool from original pool
  const randomArrPool = getRandomArrPool(pool)
  // start generating tinyId
  return getTinyId(randomArrPool)
}
module.exports = tinyIdGenerator