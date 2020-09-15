import React from 'react';
import serviceList from './../../service/services'
import EditIcon from '@material-ui/icons/Edit';
import Pagination from "react-js-pagination";
import './styles.css'
class Dashboard extends React.Component {

  state = {
    data: [],
    flag: 0,
    updatedValue: '',
    activePage: 0,
    totalPage:0
  }
  async dataListCheck(page) {
    let responseData = []
    let data = {
      "pageNo": page,
      "limit": 8,
      "sortBy": "desc",
      "fromDate": "",
      "toDate": "",
      "searchText": "",
      "orderBy": ""
    }
    let dataList = await serviceList.searchQuestions(data);
    dataList.data.content.map((x, index) => {
      let obj = {
        "id": x.id,
        "ipAddress": x.ipAddress,
        "createdOn": x.createdOn.split('T')[0],
        "questionBody": x.questionBody,
        "answer": x.answerList.length > 0 ? x.answerList[x.answerList.length - 1].answerBody : '',
        "editFlag": 0
      }
      responseData.push(obj)
    })
    console.log('DataList ->', dataList)
    this.setState({totalPage:dataList.data.totalElements})
    this.setState({ data: responseData })
  }

  componentDidMount() {
    this.dataListCheck(0)
  }
  edit = (data) => {

    // this.setState({ flag: 1 })
    const elementsIndex = this.state.data.findIndex(element => element.id == data.id)
    let newArray = [...this.state.data]
    newArray[elementsIndex] = { ...newArray[elementsIndex], editFlag: 1 }
    this.setState({
      data: newArray,
    });
  }
  submit = (data) => {
    const elementsIndex = this.state.data.findIndex(element => element.id == data.id)
    let newArray = [...this.state.data]
    newArray[elementsIndex] = { ...newArray[elementsIndex], editFlag: 0 }
    newArray[elementsIndex] = { ...newArray[elementsIndex], answer: this.state.updatedValue }
    this.setState({
      data: newArray,
    });
    this.updateAnswer(newArray, data.id)
  }
  changeValue = (e) => {
    this.setState({ updatedValue: e.target.value })
  }
  updateAnswer = (finalValue, id) => {
    console.log('Data ->', finalValue, id)
    const elementsIndex = finalValue.findIndex(element => element.id == id)
    let objList = [{
      "ipAddress": finalValue[elementsIndex].ipAddress,
      "answerBody": finalValue[elementsIndex].answer
    }]
    serviceList.answer(objList, id)
  }
  handlePageChange(pageNumber) {
    // console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber-1 });
    this.dataListCheck(pageNumber-1)
    console.log(`active page is ${pageNumber}`);
  }
  render() {
    return (
      <div>
        <table className="tablecheck" style={{ width: '95%' }}>
          <thead>
            <tr className="headerCheck">
              <th scope="col"></th>
              <th scope="col">IP Address</th>
              <th scope="col">Created Date</th>
              <th scope="col">Question</th>
              <th scope="col">Answer</th>
            </tr>
          </thead>
          <tbody id="cursorPointer">
            {/*Rendering data*/}
            {this.state.data.map((item, key) => {
              return (
                <tr key={key} className="RowCheck" >
                  <td>
                    
                      {/* <button onClick={() => this.edit(item)}> */}
                      <i class="fa fa-edit fa-lg" onClick={() => this.edit(item)}></i>
                      {/* </button> */}
                    
                  </td>
                  <td>{item.ipAddress}</td>
                  <td>{item.createdOn}</td>
                  <td>{item.questionBody}</td>
                  <td>{item.editFlag == 0 ? item.answer : <textarea rows="3" cols="30" onChange={this.changeValue.bind(this)} label={item.answer} />}</td>
                  <td>{item.editFlag == 1 ? <i class="fa fa-check-square fa-lg" onClick={() => this.submit(item)}></i> : ''}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="page">
          <Pagination
            activePage={this.state.activePage+1}
            itemsCountPerPage={6}
            totalItemsCount={this.state.totalPage}
            // pageRangeDisplayed={3}
            onChange={this.handlePageChange.bind(this)}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
    );
  }
}
export default Dashboard