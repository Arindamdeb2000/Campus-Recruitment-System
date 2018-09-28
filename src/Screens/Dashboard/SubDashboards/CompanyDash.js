import React, { Component } from "react";
import fire from "../../../config/fire";

class CompanyDash extends Component {
  constructor() {
    super();
    this.state = {
      // form states
      title: '',
      description: '',
      salary: null,
      eligibility: null,
      skills: '',
      companyName: localStorage.getItem('displayName'),
      uid: localStorage.getItem('uid'),
      time: new Date().toLocaleString(),
      // other states
      show: "findStudents",
      studentArr: []
    };
    this.postAJob_FUNC = this.postAJob_FUNC.bind(this);
    this.findStudents_FUNC = this.findStudents_FUNC.bind(this);
  }

  postAJob_FUNC() {
    const { title, description, salary, eligibility, skills, companyName, uid, time } = this.state
    fire.database().ref(`/company_jobs/${uid}/`).push({ title, description, salary, eligibility, skills, companyName, uid, time }).then(() => {
      window.location = '/dashboard'
    })
  }

  postAJob_JSX() {
    const { companyName } = this.state
    return (
      <div>
        <h1 className="text-uppercase text-danger">Post a new Job</h1><br />
        <div className="form-group">
          <label>Company Name:</label>
          <input type="text" className="form-control" value={companyName} readOnly />
        </div>
        <div className="form-group">
          <label>Job Title:</label>
          <input type="text" className="form-control" onChange={(e) => { this.setState({ title: e.target.value }) }} />
        </div>
        <div className="form-group">
          <label>Job Description:</label>
          <textarea cols="30" rows="5" className="form-control" onChange={(e) => { this.setState({ description: e.target.value }) }} ></textarea>
        </div>
        <div className="form-group">
          <label>Salary:</label>
          <input type="number" className="form-control" onChange={(e) => { this.setState({ salary: e.target.value }) }} />
        </div>
        <div className="form-group">
          <label>Eligibility:</label>
          <input type="number" className="form-control" onChange={(e) => { this.setState({ eligibility: e.target.value }) }} placeholder="vacancies" />
        </div>
        <div className="form-group">
          <label>Skills:</label>
          <input type="text" className="form-control" onChange={(e) => { this.setState({ skills: e.target.value }) }} placeholder="comma separated values" />
        </div>
        <button className="btn btn-dark  btn-block btn-lg" onClick={this.postAJob_FUNC} >Submit</button>
        <br />
      </div>
    )
  }

  findStudents_FUNC() {
    let { studentArr } = this.state
    fire.database().ref('/student_resumes').once("value", data => {
      let studentData = data.val()
      // console.log(studentData);
      for (const key in studentData) {
        studentArr.push(studentData[key])
      }
      this.setState({ studentArr })
    })
  }

  hire(studentData) {
    fire.database().ref(`/company_data/${fire.auth().currentUser.uid}/hire/${studentData.uid}/`).set(studentData).then(() => { alert('Notification sent') })
  }

  componentDidMount() {
    this.findStudents_FUNC();
  }

  render() {
    const { show, studentArr } = this.state
    return (
      <div className="container-fluid">
        {/* <p>CompanyDash</p> */}
        <div className="row">
          <div className="col-md-9">
            <br />
            {
              show === "newJob"
                ? this.postAJob_JSX()
                : show === "findStudents"
                  ? <div>
                    {
                      studentArr.map((v) => {
                        return <div className="card border-danger mb-3" key={`${v.uid}`}>
                          <h5 className="card-header text-danger">Student Name: {v.name}</h5>
                          <div className="card-body">
                            {/* <h5 className="card-title"></h5> */}
                            <div className="row">
                              <div className="col">
                                <p className="card-text">Father Name: {v.fatherName}</p>
                              </div>
                              <div className="col">
                                <p className="card-text">DOB: {v.dob}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                <p className="card-text">Experience: {v.experience}</p>
                              </div>
                              <div className="col">
                                <p className="card-text" style={{ fontSize: '10pt', color: "black" }} >Home Address: {v.address}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                <p className="card-text">Percentage: {v.percentage}</p>
                              </div>
                              <div className="col">
                                <p className="card-text">Qualification: {v.qualification}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                <p className="card-text">Email: {v.email}</p>
                              </div>
                              <div className="col">
                                <p className="card-text">Phone: {v.phone}</p>
                              </div>
                            </div>
                          </div>
                          <div className="card-footer"><button className="btn btn-outline-danger pull-right" onClick={() => { this.hire(v) }}>Hire</button></div>
                        </div>
                      })
                    }
                  </div>
                  : show === "inbox"
                    ? <div>RENDER: Inbox</div>
                    : show === "myPosts"
                      ? <div>RENDER: My Posts</div>
                      : <br />
            }
          </div>
          <div className="col-md-3">
            <br />
            <button className="btn btn-block btn-sm btn-outline-primary" onClick={() => {
              this.setState({ show: "newJob" });
              window.location.hash = "newJob"
            }}>
              Post a new job
            </button>
            <button className="btn btn-block btn-sm btn-primary" onClick={() => {
              this.setState({ show: "findStudents" });
              window.location.hash = "findStudents"
            }}>
              Find Students
            </button>
            <hr />
            <button className="btn btn-block btn-sm btn-primary" onClick={() => {
              this.setState({ show: "inbox" });
              window.location.hash = "inbox"
            }}>Inbox</button>
            <button className="btn btn-block btn-sm btn-primary" onClick={() => {
              this.setState({ show: "myPosts" });
              window.location.hash = "myPosts"
            }}>
              My Posts
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyDash;
