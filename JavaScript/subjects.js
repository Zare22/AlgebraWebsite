var subjects = [];
var addedSubjects = [];

fillSubjects();
getSubject();

function fillSubjects() {
    $(document).ready(function() {
        $.getJSON("http://www.fulek.com/VUA/SUPIT/GetNastavniPlan", function(data) {
            $.each(data, function(id, val) {
                let subject = {
                    "name": val["label"],
                    "key": val["value"]
                }
                subjects.push(subject);
            });

            subjects.forEach(s => {
                $("#subjects").append("<option>" + s.name + "</option>");
            });
        });
    });
}



function getSubject() {
    $("#subjectsInput").on('keyup', function (e) {
        if (e.key === 'Enter') {
            let subject = subjects.find(s => s.name === $("#subjectsInput").val());
            if (subject != null) {
                GetSubjectDetails(subject.key);
                
            }
        }
    });
}

function GetSubjectDetails(key) {
    $.getJSON("http://www.fulek.com/VUA/supit/GetKolegij/" + key, function(data) {
        let subject = {
            "id": data["id"],
            "subject": data["kolegij"],
            "ects": data["ects"],
            "hours": data["sati"],
            "lectures": data["predavanja"],
            "practical": data["vjezbe"],
            "type": data["tip"],
            "semester": data["semestar"]
        }
        if(addedSubjects.findIndex(s => s.id === subject.id) === -1){
            addedSubjects.push(subject);
            AddSubjectToTable(subject);
            $("#tablesSection").css('visibility', 'visible');
        }
    });
}
function AddSubjectToTable(s) {
    
    let tableRow =
        "<tr id='"+s.id+"'>"+
        "<td id='subjectName'>"+s.subject+"</td>"+
        "<td>"+s.ects+"</td>"+
        "<td>"+s.hours+"</td>"+
        "<td>"+s.lectures+"</td>"+
        "<td>"+s.practical+"</td>"+
        "<td>"+s.type+"</td>"+
        "<td></td>"+
        "<td>"+" <button onclick='deleteSubject("+s.id+")'>Obriši</button> "+"</td>"+
        "</tr>";
    $(tableRow).insertBefore("#lastTr");

    CalculateECTSandHours();
}

function deleteSubject(id){
    $("#"+id.toString()).remove();
    addedSubjects.splice(addedSubjects.findIndex(s => s.id === id), 1);
    CalculateECTSandHours();
    if(addedSubjects.length === 0){
        $("#tablesSection").css('visibility', 'hidden');
    }
}

function CalculateECTSandHours(){
    let ectsSUM = 0;
    let hoursSUM = 0;

    addedSubjects.forEach(s => {
        ectsSUM += s.ects;
        hoursSUM += s.hours;
    });

    $("#ects").html(ectsSUM);
    $("#hours").html(hoursSUM);
}

// #tablesSection{
//     visibility: hidden;
// }
//Show #tablesSection if #ects > 0
