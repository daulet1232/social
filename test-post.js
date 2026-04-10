fetch("http://localhost:3000/api/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    content: "hello world",
    authorId: "daulet"
  })
})
.then(res => res.json())
.then(console.log)