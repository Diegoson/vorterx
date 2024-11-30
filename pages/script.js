document.getElementById("submit").addEventListener("click", function () {
  const loader = document.getElementById("coolLoader");
  const message = document.getElementById("message");
  message.textContent = "";
  loader.style.display = "block";
  setTimeout(() => {
    loader.style.display = "none";
    message.classList.add("success");
  }, 4000); 
});
let a = document.getElementById("pair");
let b = document.getElementById("submit");
let c = document.getElementById("number");
let box = document.getElementById("box");
async function Copy() {
  let text = document.getElementById("copy").innerText;
  let obj = document.getElementById("copy");
  await navigator.clipboard.writeText(obj.innerText.replace('CODE: ', ''));
  obj.innerText = "COPIED";
  obj.style = "color:blue;font-weight:bold";
  obj.size = "5";
  setTimeout(() => {
    obj.innerText = text;
    obj.style = "color:black;font-weight-bold";
    obj.size = "5";
  }, 500);
}
b.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!c.value) {
    a.innerHTML = '<a style="color:black;font-weight:bold">Enter_number_country_code</a><br><br>';
  } else if (c.value.replace(/[^0-9]/g, "").length < 11) {
    a.innerHTML = '<a style="color:black;font-weight:bold">Invalid number format</a><br><br>';
  } else {
    const bc = c.value.replace(/[^0-9]/g, "");
    let bb = "";
    let bbc = "";
    const cc = bc.split('');
    cc.map(a => {
      bbc += a;
      if (bbc.length == 3) {
        bb += " " + a;
      } else if (bbc.length == 8) {
        bb += " " + a;
      } else {
        bb += a;
      }
    });
    c.type = "text";
    c.value = "+" + bb;
    c.style = "color:black;font-size:20px";
    let { data } = await axios(`/code?number=${bc}`);
    let code = data.code || "error_go_again😂";
    a.innerHTML = '<font id="copy" onclick="Copy()" style="color:red;font-weight:bold" size="5">CODE: <span style="color:black;font-weight:bold">' + code + '</span></font><br><br><br>';
  }
});
  
