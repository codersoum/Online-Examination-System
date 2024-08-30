const popupmenu = document.querySelector(".popupmenu");
const buttons = document.getElementsByClassName("button");
//console.log(buttons)
for(var i=0;i<buttons.length;i++)
{
  if(i===0)
  buttons[0].addEventListener("click",()=>{
    document.body.classList.toggle("show-popup");
  })
}
const removes = document.getElementsByClassName("material-symbols-outlined");
  for(var i=0;i<removes.length;i++)
  {
  removes[i].addEventListener('click',()=>{
    document.body.classList.remove("show-popup");
  })
  }
   fetch(`http://localhost:8000/studentdata`)
   .then((response) => {
      console.log(response.status)
      console.log(response.ok)
      console.log(response.headers)
      return response.json()
   })
   .then((response)=> {
        console.log(response);
       const login = document.getElementById("lblogin");
       const password = document.getElementById("lbpass")
       login.innerHTML = 'User'+'_'+response.message;
       password.innerHTML=response.value;
   })
   fetch(`http://localhost:8000/admindata`)
   .then((response) => {
      console.log(response.status)
      console.log(response.ok)
      console.log(response.headers)
      return response.json()
   })
   .then((response)=> {
        console.log(response);
       const login = document.getElementById("Allogin");
       const password = document.getElementById("Alpass")
       //localStorage.setItem("User",response.message)
       login.innerHTML = 'Admin'+'_'+response.message;
       password.innerHTML=response.value;
   })
 function goToNextPage()
 {
   window.location.href="http://localhost:8000/Login.html"
 }
 function goToPage()
 {
   window.location.href="http://localhost:8000/ALogin.html"
 }
 function goDelpage()
 {
   window.location.href="http://localhost:8000/Logout.html"
 }
 function goAdmindel()
{
  window.location.href="http://localhost:8000/ALogout.html"
}
function val() {
  const testname = document.getElementById("testname").value;
  const testst = document.getElementById("testst").value;
  const testen = document.getElementById("testen").value;
  const testmark = document.getElementById("marks").value;
  const testQ = document.getElementById("Questions").value;
  alert(`${testname } added  successfully!!`);
  fetch(`http://localhost:8000/posttest`, {
      method: "POST",
      headers: {
          "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
          "TestName": testname,
          "StartingTime": testst,
          "EndingTime": testen,
          "Marks": testmark,
          "Questions": testQ
      })
  })
  .then((response)=> {
    console.log(response.status)
    return response.json()
  })
  .then(data => {
      console.log(data);
  })
  .catch(error => {
      console.error('Error:', error);
  });
}
 function show()
 {
  fetch(`http://localhost:8000/gettest`)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
          var tablebody = document.getElementById("tabletest");
      for (var i = 0; i < data.length; i++) {
          var row = `<tr>
                  <td>${i + 1}</td>
                  <td>${data[i].TestName}</td>
                  <td>${data[i].StartingTime}</td>
                  <td>${data[i].EndingTime}</td>
                  <td>${data[i].Marks}</td>
                  <td>${data[i].Questions}</td>
              </tr>`;
          tablebody.innerHTML += row;
      }
 })
}
function remtest()
{
  const testname = document.getElementById("testname").value;
  alert(`${testname} has been deleted!`);
  fetch(`http://localhost:8000/deletest/${testname}`,
    {method:'DELETE'}
  )
  .then((response)=>{
    return response.json()
  })
  .then((data)=>{
    if(data.success)
     console.log(data)
    else
    {
      console.log("fetch-error",error)
    }
  })
}
function updatetest() {
  const testname = document.getElementById("testname").value;
  const testst = document.getElementById("testst").value;
  const testen = document.getElementById("testen").value;
  const testmark = document.getElementById("marks").value;
  const testQ = document.getElementById("Questions").value;
  alert(`${testname} has been updated!!`);
  fetch(`http://localhost:8000/updatetest`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "TestName": testname,
      "StartingTime": testst,
      "EndingTime": testen,
      "Marks": testmark,
      "Questions": testQ
    })
  })
  .then((response)=> {
    console.log(response.status)
    return response.json();
  })
  .then(data => {
    if (data.success) {
      console.log(data);
    } else {
      console.error('Fetch error:', data);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
const respond=document.getElementById("fetch");
const add=document.getElementById("Addin")
add.addEventListener('click',()=>{
  window.location.href="http://localhost:8000/addusers.html"
})
const tablebody=document.getElementById("table1");
respond.addEventListener('click',()=>{
        fetch(`http://localhost:8000/getuser`)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            console.log(data)
            for (var i = 0; i < data.length; i++)
            {
			       var row = `<tr>
							<td>${data[i].Username}</td>
							<td>${data[i].PhoneNumber}</td>
							<td>${data[i].Address}</td>
              <td>${data[i].Age}</td>
              <td>${i+1}</td>
              <td><button type="submit" id="remove" onclick="myfunct(${data[i].PhoneNumber},${i+1})">Remove Student</button></td>
              <td><button type="submit" id="update" onclick="myupdate(${data[i].PhoneNumber})">Update Student</button></td>
					    </tr>`
			      tablebody.innerHTML += row
		      }
        })
     })
     function myupdate(b)
     {
      alert("Student data updated Successfully!")
      localStorage.setItem("PN",b)
      window.location.href="http://localhost:8000/updateusers.html"
     }
     function myfunct(phone,i)
     {
      alert("Student data deleted Sucessfully!");
      fetch(`http://localhost:8000/getuser/${phone}`,
        {method:'DELETE'}
      )
      .then((response)=>{
        return response.json()
      })
      .then((data)=>{
        if(data.success)
        {
         document.getElementById("Fetchinhg").deleteRow(i);
         console.log(data)
        }
        else
        {
          console.log("fetch-error",error)
        }
      })
      ///document.getElementById("Fetchinhg").deleteRow(i);
     }
     function fetchnow()
         {
          fetch(`http://localhost:8000/gettest`)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
          var tablebody = document.getElementById("question");
      for (var i = 0; i < data.length; i++) {
          var row = `<tr>
                  <td>${i + 1}</td>
                  <td onclick="organize('${data[i].TestName}','${data[i].StartingTime}','${data[i].EndingTime}','${data[i].Marks}','${data[i].Questions}')">${data[i].TestName}</td>
                  <td>${data[i].StartingTime}</td>
                  <td>${data[i].EndingTime}</td>
                  <td>${data[i].Marks}</td>
                  <td>${data[i].Questions}</td>
              </tr>`;
          tablebody.innerHTML += row;
      }
 })
}
function organize(s,st,et,mark,ques)
 {
    //window.location.href="http://localhost:8000/Tests.html"
    localStorage.setItem("Testheading",s);
    localStorage.setItem("MaximumMarks",mark);
    localStorage.setItem("Maximum Questions",ques);
    localStorage.setItem("Starting",st);
    localStorage.setItem("Ending",et);
    window.location.href="http://localhost:8000/Tests.html"
 }