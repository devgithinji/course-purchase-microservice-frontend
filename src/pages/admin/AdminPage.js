import React, {useRef, useState} from 'react';
import CourseService from "../../services/course.service";
import CourseSave from "../../components/CourseSave";
import Course from "../../models/course";
import CourseDelete from "../../components/CourseDelete";

const AdminPage = () => {
    const [courseList, setCourseList] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(new Course('', '', 0))
    const [errorMessage, setErrorMessage] = useState('')
    const saveComponent = useRef();
    const deleteComponent = useRef();

    useState(() => {
        CourseService.getAllCourses().then(response => {
            setCourseList(response.data)
        })
    }, [])

    const editCourse = (item) => {
        setSelectedCourse(Object.assign({}, item));
        saveComponent.current?.showCourseModal();
    }

    const createCourse = () => {
        saveComponent.current?.showCourseModal();
    }

    const addCourse = (course) => {
        let courseIndex = courseList.findIndex(item => item.id === course.id)
        if (courseIndex !== -1) {
            const newList = courseList.map((item) => {
                if (item.id === course.id) {
                    return course;
                }
                return item;
            })
            setCourseList(newList)
        } else {
            const newList = courseList.concat(course);
            setCourseList(newList);
        }
    }

    const confirmDeleteCourse = (course) => {
        setSelectedCourse(course)
        deleteComponent.current?.showDeleteModal()
    }


    const deleteCourse = () => {
        CourseService.deleteCourse(selectedCourse).then(_ => {
            setCourseList(courseList.filter(item => item.id !== selectedCourse.id))
        }).catch(err => {
            setErrorMessage('something went wrong')
        })
    }

    return (
        <div className="container">
            <div className="pt-5">
                {errorMessage && (
                    <div className="alert alert-danger">
                        {errorMessage}
                    </div>
                )}
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-6">
                                <h3>All Courses</h3>
                            </div>
                            <div className="col-6 text-end">
                                <button className="btn btn-primary" onClick={createCourse}>
                                    create course
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-stripped">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Title</th>
                                <th scope="col">Price</th>
                                <th scope="col">Date</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {courseList.map((course, index) => (<tr key={course.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{course.title}</td>
                                <td>{`$ ${course.price}`}</td>
                                <td>{new Date(course.createTime).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-primary me-1" onClick={() => editCourse(course)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger" onClick={() => confirmDeleteCourse(course)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <CourseSave ref={saveComponent} onSaved={addCourse} course={selectedCourse}/>
            <CourseDelete ref={deleteComponent} onConfirmed={deleteCourse}/>
        </div>
    );
};

export default AdminPage;