const data = [{
  "paragraphs": "p",
  "author": [
    "meta[name=author]",
    ["script[type='application/ld+json']", {
      postProcessing: (data)=>{
        return JSON.parse(data).author
      }
    }],
    {
      extract: "attr",
      attr: "content"
    }
  ],
  "tupleSchema": [["p"], {
    extract: "hey"
  }]
}, {
  extract: "text"
}]