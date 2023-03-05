import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import Course from "../models/course";
import CourseService from "../services/course.service";
import {Modal} from "react-bootstrap";

const CourseSave = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        showCourseModal() {
            setTimeout(()=>{
                setShow(true)
            }, 500)
        }
    }))

    useEffect(() => {
        setCourse(props.course)
    }, [props.course])

    const [course, setCourse] = useState(new Course('', '', 0))
    const [errorMessage, setErrorMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [show, setShow] = useState(false)

    const saveCourse = (e) => {
        e.preventDefault();
        setSubmitted(true)
        if (!course.title || !course.subtitle || !course.price) {
            return;
        }

        CourseService.saveCourse(course).then((response => {
            props.onSaved(response.data)
            setShow(false)
            setSubmitted(false)
        })).catch((err) => {
            setErrorMessage('Unexpected error occurred')

        })

    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCourse(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    const handleClose = () => {
        setCourse(new Course('', '', 0))
        setShow(false)
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <form onSubmit={(e) => saveCourse(e)} noValidate className={submitted ? 'was-validated' : ''}>
                <div className="modal-header">
                    <h5 className="modal-title">Course Details</h5>
                    <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                    {errorMessage && (
                        <div className="alert alert-danger">
                            {errorMessage}
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="title">Title: </label>
                        <input
                            type='text'
                            className='form-control'
                            name="title"
                            placeholder="title"
                            value={course.title}
                            onChange={event => handleChange(event)}
                            required
                        />
                        <div className='invalid-feedback'>
                            Title is required
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="subtitle">Sub Title: </label>
                        <input
                            type='text'
                            className='form-control'
                            name="subtitle"
                            placeholder="subtitle"
                            value={course.subtitle}
                            onChange={event => handleChange(event)}
                            required
                        />
                        <div className='invalid-feedback'>
                            Sub Title is required
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Title: </label>
                        <input
                            type='number'
                            className='form-control'
                            name="price"
                            min="1"
                            step="any"
                            placeholder="price"
                            value={course.price}
                            onChange={event => handleChange(event)}
                            required
                        />
                        <div className='invalid-feedback'>
                            Price is required and should be greater than 0
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>
                        Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    )
});

export default CourseSave;