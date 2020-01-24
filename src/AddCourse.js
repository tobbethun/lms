import React, {useState} from "react";

const AddCourse = ({email, allCourses, usersCourses}) => {
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedValue, setSelectedValue] = useState("");

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const pin = prompt("Verifiera med Pin kod");
        const newCourse = {
            email: email,
            course_id: selectedValue,
            pin: pin
        };

        fetch("/api/admin/addCourseToUSer/", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },

            //make sure to serialize your JSON body
            body: JSON.stringify(newCourse)
        })
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.code === 200) {
                    setMessage(json.success);
                    setTimeout(() => {
                        setMessage(null);
                        setShowUserInfo(false);
                    }, 2500);
                }
                if (json.code === 204) {
                    setMessage(json.success);
                    setTimeout(() => setMessage(null), 2500);
                }
            })
            .catch(e => {
                console.log("error", e);
                setMessage("Ingen kontakt med servern. Kontrollera din internetuppkoppling. Ladda sedan om sidan.");
            });
    };
    const courseList = usersCourses.split(" ");
    return (
        <div>
            <span onClick={()=> setShowUserInfo(!showUserInfo)}>Lägg till kurs</span>
            {showUserInfo &&
            <form
                className="admin-update-userInfo"
                onSubmit={handleSubmit}
            >
                <select value={selectedValue} onChange={handleChange}>
                    <option>Välj kurs</option>
                    {allCourses &&
                        allCourses.map((course, index) => <option key={index} value={course.id} disabled={courseList.includes(course.id.toLowerCase())}>{course.title}</option>)
                    }
                </select>

                <button className="admin-update-button">
                    Lägg till
                </button>
            </form>
            }
            {message}
        </div>
    );
};

export default AddCourse;
