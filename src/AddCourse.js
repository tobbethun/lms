import React, {useState} from "react";

const AddCourse = ({email}) => {
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const pin = prompt("Verifiera med Pin kod");
        const newCourse = {
            email: email,
            course_id: e.target.course_id.value,
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

    return (
        <div>
            <span onClick={()=> setShowUserInfo(!showUserInfo)}>Lägg till kurs</span>
            {showUserInfo &&
            <form
                className="admin-update-userInfo"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    name="course_id"
                    placeholder="Lägg till kurs-id"
                    required
                />
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
