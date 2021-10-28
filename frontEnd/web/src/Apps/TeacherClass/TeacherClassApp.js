import axios from 'axios';
import  React  from 'react';
import { Redirect, withRouter } from "react-router-dom";
import getIP from '../../settings.js';
import './TeacherClassApp.css';
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Modal from 'react-bootstrap/Modal'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Card from 'react-bootstrap/Card'


class TeacherClassApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      class_code: this.props.location.state.class.class_code, 
      class_name: this.props.location.state.class.class_name,
      teacher_id:  this.props.location.state.teacher_id,
      students: [],
      
      selected: [],
      selected_name: "",
      selected_balance: "",
      selected_id: "",
      amount: '',

      bank_id: '',
      interest_rate: "",
      payout_rate: "",
      student_savings: [],
      banks: [],

      shops: [],
      shop_id: 0,
      classHasShop: false,
      items: [],
      showUpdateItem:false,
      showAddItem:false,
      showCreateStore: false,
      item_name: '',
      item_desc: '',
      item_price: 0,
      item_id: 0,
      store_name: '',
      item_import_class_code: '',
      item_import_store: [],
      item_import_list: [],

      classHasTaxes: false,
      class_tax: {},
      checked: '',
      current_tax_type: '',
      current_value: '',
      newSimpleValue: '',
      progAmount: 0,
      regAmount: 0,
      current_low: '',
      current_high: '',
      current_per: '',
      arOfLows: [],
      arOfHighs: [],
      arOfPer: [],
      regArOfLows: [],
      regArOfHighs:[],
      regArOfPer:[],
      current_bracket: {},
      arOfBrackets: [],
      current_sales_tax:'',
      current_percent_tax:'',
      current_flat_tax: '',
      form_id: '',
      class_prog_brackets:[],
      class_reg_brackets:[],
      progArOfId:[],
      regArOfId: [],

      error: '',
      bank_error: '',
      store_error: '',
      tax_error: '',
      classHasBank: false,
      redirect_profile: false,
      bankModalShow: false,
      updateBankModalShow: false,
      showCreateTaxes: false,
      showUpdateTax: false,
      showImportItems: false,
    };
    this.handleProfileRedirect = this.handleProfileRedirect.bind(this)
    this.studentClicked = this.studentClicked.bind(this)
    this.renderStudents = this.renderStudents.bind(this)
    this.amountIsValid = this.amountIsValid.bind(this)
    this.changeSelected = this.changeSelected.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.createBankModal = this.createBankModal.bind(this)
    this.onUpdateLowChange = this.onUpdateLowChange.bind(this)

  }

  componentDidMount(){
    this.getClassStudents()
    this.getBanks()
    this.getShops()
    this.getTaxes()
  }

  studentClicked(student){
    this.setState({selected_name: student.name})
    this.setState({selected_balance: student.balance})
    this.setState({selected_id: student.id})
    var select = false;
    var index = 0;
    for(let i = 0; i <= Object.keys(this.state.selected).length-1; i++)
    {
      if(student.id === this.state.selected[i])
      {
          select = true;
          index = i;
          break;
      }
    }
    if(select === true)
    {
      var temparray = this.state.selected
      temparray.splice(index, 1)
      this.setState({selected: temparray})
    }
    else
    {
      this.setState(prevState => ({selected: [...prevState.selected, student.id]}))
    }
}

  handleProfileRedirect(){
    this.setState({redirect_profile: true})
  }

  getClassStudents() {
    axios.get(getIP()+'/students/')
    .then(response => {
      this.setState({students:response.data});
      this.getCurrentClassStudents(response.data)
    })
    .catch(error => console.log(error))
  }

  getCurrentClassStudents(students){
    var newAr = []
    for (let i = 0; i<=Object.keys(students).length -1;i++)
    {
        if(students[i].class_code===this.state.class_code)
        {
          newAr.push(students[i])
        }
    }
    this.setState({students:newAr})
  }

  isStudentInClass(student_name){
    for (let i = 0; i<Object.keys(this.state.students).length;i++)
    {
      if(student_name === this.state.students[i].name)
      {
        return true
      }
    }
    return false
  }
  
  renderStudents(student, x){
    var select = false;
      for(let i = 0; i <= Object.keys(this.state.selected).length-1; i++)
      {
        if(student.id === this.state.selected[i])
        {
          select = true;
          break;
        }
      }
      if (select === true)
      {
        return(
          <ListGroup.Item key={x} active action onClick={() => this.studentClicked(student)}>{student.name} {"---------- Balance:"}  {student.balance}</ListGroup.Item>
        )
      }
      else if (select === false)
      {
        return(
          <ListGroup.Item key={x} action onClick={() => this.studentClicked(student)}>{student.name} {"---------- Balance:"} {student.balance}</ListGroup.Item>
        )
      }
    }

    renderStudentSavings(student, i){
      if(student.active === true)
      {
        return(
          <ListGroup.Item key={i}>{student.name}: {student.initial_amount} {'-->'}  {student.interest_rate}%  {'-->'}  ${student.final_amount} Pays out in: {student.payout_date}</ListGroup.Item>
        )
      }
    }

    renderStoreItems(item, i){
      return(
        <Card key={i}>
          <Card.Body>
            <Card.Title> {item.item_name} {"------"} {item.price} </Card.Title>
            <Card.Text> {item.description} <Button variant="primary" onClick={() => this.storeClickedItem(item.item_name, item.price, item.description, item.id)}>Update Item</Button> </Card.Text>
          </Card.Body>
        </Card>
      )
    }

    handleChange(e) {
      const field = e.target.id
      this.setState({ [field] : e.target.value });
    }

    amountIsValid(amount){
      if(isNaN(amount)){
        this.setState({error: 'Make sure that amount is a number'})
        return false
      }
      else{
        if(Math.sign(amount) === 1){
            return true
        }
        else{
            this.setState({error: 'Make sure that amount is a positive number'})
            return false
        }
      }
  } 
  
  changeSelected(pay){
    var selected_amount = this.state.amount 
    if(this.amountIsValid(selected_amount)) {
      if(!pay) {
        selected_amount= "-" + this.state.amount
      }
      var selected = this.state.selected
      for(let i = 0; i <= Object.keys(selected).length-1; i++)
      {
        var payload = { user_id: selected[i], amount: selected_amount }; 
        axios.put(getIP()+'/students/balance/', payload)
        .then(response => {
            axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": selected_amount})
            .then(response => {
              this.getClassStudents()
              this.setState({selected: []})
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
      }
      this.setState({show:false})
    }
  }

  getShops(){
    axios.get(getIP()+'/shops/')
    .then(response => {
      this.setState({shops: response.data})
      this.checkForShop(response.data)
    })
    .catch(error => console.log(error))
  }

  checkForShop(shops){
    for(let i = 0; i <= Object.keys(shops).length - 1; i++){
      if(shops[i].class_code === this.state.class_code){
        this.setState({classHasShop:true, store_name: shops[i].shop_name, shop_id: shops[i].id})
      }
    }
    this.getItems("local")
  }

  async importHasShop(){
    var completed = false
    await axios.get(getIP()+'/shops/')
    .then(async (response) => {
      for(let i = 0; i <= Object.keys(response.data).length - 1; i++){
        if(response.data[i].class_code === this.state.item_import_class_code){
          this.setState({item_import_store: response.data[i]})
          await this.getItems("import")
          completed = true
        }
      }
    })
    .catch(error => console.log(error))
    if(completed)
    {
      return true
    }
    else
    {
      return false
    }
  }

   async getItems(type){
    await axios.get(getIP()+'/items/')
    .then(async (response) => {
      return await this.getShopItems(response.data, type)
    })
    .catch(error => console.log(error))
  }

   async getShopItems(allItems, type){
    var ar = []
    if(type === "local")
    {
      for(let i = 0; i<=Object.keys(allItems).length -1; i++)
      {
        if(allItems[i].shop_id === this.state.shop_id)
        {
          ar.push(allItems[i])
        }
      }
      this.setState({items:ar})
      return true
    }
    else if(type === "import")
    {
      for(let i = 0; i<=Object.keys(allItems).length -1; i++)
      {
        if(allItems[i].shop_id === this.state.item_import_store.id)
        {
          ar.push(allItems[i])
        }
      }
      this.setState({item_import_list:ar})
      return true
    }
    
  }

  createNewStore(){
    if(this.state.store_name !== "")
    {
      axios.post(getIP()+'/shops/', {
        shop_name: this.state.store_name,
        class_code: this.state.class_code,
      })
      .then(response => {
        this.setState({showCreateStore: false, classHasShop: true, shop_id: response.data.id})
      })
      .catch(error => console.log(error))
    }
    else
    {
      this.setState({store_error: "Please enter a valid store name"})
    }
  }

  addItem(){
    if(this.validateItem())
    {
      axios.post(getIP()+'/items/', {
        item_name: this.state.item_name,
        description: this.state.item_desc,
        price: this.state.item_price,
        shop_id: this.state.shop_id,
      })
      .then(response => {
        this.setState({showAddItem: false, items: [...this.state.items, response.data]})
      })
      .catch(error => console.log(error))
    }
  }

  updateItem(){
    if(this.validateItem())
    {
      axios.put(getIP()+'/items/'+ this.state.item_id, {
        item_name: this.state.item_name,
        description: this.state.item_desc,
        price: this.state.item_price,
        shop_id: this.state.shop_id,
      })
      .then(response => {
        this.setState({showUpdateItem: false, items: []})
        this.getItems("local")
      })
      .catch(error => console.log(error))
    }
  }

  storeClickedItem(name, price, description, id){
    this.setState({showUpdateItem:true})
    this.setState({item_name:name})
    this.setState({item_price:price})
    this.setState({item_desc:description})
    this.setState({item_id:id})
  }

  deleteItem(){
    axios.delete(getIP()+'/items/'+ this.state.item_id)
    .then(response => {
      this.setState({showUpdateItem: false, items: []})
      this.getItems("local")
    })
    .catch(error => console.log(error))
  }
  
  importStoreItems(){
    axios.get(getIP()+'/classrooms/')
    .then(async (response) => {
      for(let i = 0; i <= Object.keys(response.data).length - 1; i++){
        if(this.state.item_import_class_code === response.data[i].class_code)
        {
          var passed = await this.importHasShop()
          if(passed)
          {
            for(i = 0; i<Object.keys(this.state.item_import_list).length; i++)
            {
              axios.post(getIP()+'/items/', {
                item_name: this.state.item_import_list[i].item_name,
                description: this.state.item_import_list[i].description,
                price: this.state.item_import_list[i].price,
                shop_id: this.state.shop_id,
              })
              .then(response => {
                this.setState({showImportItems: false, items: [...this.state.items, response.data]})
              })
              .catch(error => console.log(error))
            }   
          }
        }
      }
    })
    .catch(error => console.log(error))
  }

  getBanks(){
    axios.get(getIP()+'/banks/')
    .then(response => {
      this.setState({banks: response.data})
      this.checkForBank(response.data)
    })
    .catch(error => console.log(error))
  }

  checkForBank(banks){
    for(let i = 0; i <= Object.keys(banks).length - 1; i++){
      if(banks[i].class_code === this.state.class_code){
        this.setState({classHasBank:true})
        this.setState({bank_id: banks[i].id})
        this.setState({interest_rate: banks[i].interest_rate})
        this.setState({payout_rate: banks[i].payout_rate})
      }
    }
    this.getStudentSavings()
  }

  getStudentSavings(){
    axios.get(getIP()+'/transactioninterestrates/')
    .then(response1 => {
      for(let i = 0; i <= Object.keys(response1.data).length-1; i++)
      {
        axios.get(getIP()+'/transactions/' + response1.data[i].transaction_id)
        .then(response2 => {
          var initamount = parseFloat(response2.data.amount)
          axios.get(getIP()+'/users/' + response2.data.sender_id + '/')
          .then(userresponse => {
            if(this.isStudentInClass(userresponse.data.first_name))
            {
              var intrate = parseFloat(response1.data[i].set_interest_rate)
              var finalamount = initamount + (initamount*(intrate/100))
              axios.get(getIP()+'/transactioninterestrates/payoutdate/' + response2.data.id)
              .then(response => {
                var payout_date = (((response.data / 60) / 60) / 24)
                var tempdict = {
                  "id": i, 
                  "name": userresponse.data.first_name, 
                  "initial_amount": initamount, 
                  "interest_rate": intrate, 
                  "final_amount": finalamount, 
                  "payout_date": payout_date,
                  "active": response1.data[i].active
                }
                this.setState({student_savings: [...this.state.student_savings, tempdict]})
                })
                .catch(error => console.log(error))
            }
          })
          .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
      }
    })
    .catch(error => console.log(error))
  }

  hasBank(){
    return(
      <Col className="bank-col">
        <h4>{this.state.class_name} Bank</h4>
        <h6>Interest Rate: {this.state.interest_rate}</h6>
        <h6>Payout Rate: {this.state.payout_rate}</h6>
        <ListGroup className="small-group">
          {this.state.student_savings.map((student,i) => this.renderStudentSavings(student, i))}
        </ListGroup>
        <Button className="pay-btns" onClick={() => this.setState({updateBankModalShow: true})}>Update Bank Rates</Button>
        {this.updateBankModal()}
      </Col>
    )
  }

  hasNoBank(){
    return (
      <Col>
        <h4>This class has no bank</h4>
        <Button variant="primary" onClick={() => this.setState({bankModalShow: true})}>
          Create A Bank
        </Button>
        {this.createBankModal()}
      </Col>
    );
  }

  renderBankView(){
    if(this.state.classHasBank === true)
    {
      return(
          this.hasBank()
      )
    }

    else{
      return(
          this.hasNoBank()
      )
    }
  }

  hasShop(){
    return (
      <Col className="store-col">
        <h4>{this.state.store_name} Store</h4>
        <ListGroup className="small-group">
          {this.state.items.map((item,i) => this.renderStoreItems(item, i))}
        </ListGroup>
        <Button variant="primary" className="pay-btns" onClick={() => this.setState({showAddItem: true})}>
          Add Item
        </Button>
        <Button variant="primary" className="pay-btns" onClick={() => this.setState({showImportItems: true})}>
          Import Store Items
        </Button>
        {this.addItemModal()}
        {this.updateItemModal()}
        {this.importStoreItemsModal()}
      </Col>
    );
  }

  hasNoShop(){
    return (
      <Col>
        <h4>This class has no store</h4>
        <Button variant="primary" onClick={() => this.setState({showCreateStore: true})}>
          Create A Store
        </Button>
        {this.createStoreModal()}
      </Col>
    );
}

  renderShopView(){
    if(this.state.classHasShop)
    {
      return(
        this.hasShop()
      )
    }

    else{
      return(
        this.hasNoShop()
      )
    }
  }

  getTaxes(){
    axios.get(getIP()+'/taxes/')
    .then(response => {
      this.checkForClassTax(response.data)
    })
    .catch(error => console.log(error))
  }

  checkForClassTax(alltaxes){
    for(let i = 0; i <= Object.keys(alltaxes).length -1; i++){
      if(alltaxes[i].class_code === this.state.class_code){
        this.setState({classHasTaxes: true})
        this.setState({class_tax: alltaxes[i]})
      }
    }
   }

   taxClickedItem(tax_type){
    this.getAllBrackets()
    this.setState({current_tax_type:tax_type})
    if(tax_type === 'Flat Tax'){
      this.setState({showUpdateTax:true})
      this.setState({current_value:this.state.class_tax.flat_tax})
      this.setState({form_id: "current_flat_tax"})
    }
    else if(tax_type === 'Percentage Tax'){
      this.setState({showUpdateTax:true})
      this.setState({current_value:this.state.class_tax.percentage_tax})
      this.setState({form_id: "current_percent_tax"})
    }
    else if(tax_type === "Progressive Tax"){
      this.setState({showUpdateTax:true})
    }
    else if(tax_type === "Regressive Tax"){
      this.setState({showUpdateTax:true})
    }
  }

  updateEasyTax(tax_type){
    var payload = {}
    if(tax_type === 'Flat Tax'){
      if(this.flat_tax_isValid(this.state.current_flat_tax)){
        
        payload = {
          class_code: this.state.class_tax.class_code,
          flat_tax: this.state.current_flat_tax,
          percentage_tax: this.state.class_tax.percentage_tax,
          sales_tax: this.state.class_tax.sales_tax,
          id: this.state.class_tax.id,
        }
        axios.put(getIP()+'/taxes/'+ this.state.class_tax.id, payload )
        .then(response => {
        })
        .catch(error => console.log(error))
        this.setState({class_tax: payload})
        this.setState({showUpdateTax:false})
    }
  }

  else if(tax_type === 'Percentage Tax'){
    if(this.percentage_tax_isValid(this.state.current_percent_tax)){
      payload = {
        class_code: this.state.class_tax.class_code,
        flat_tax: this.state.class_tax.flat_tax,
        percentage_tax: this.state.current_percent_tax,
        sales_tax: this.state.class_tax.sales_tax,
        id: this.state.class_tax.id,
      }
      axios.put(getIP()+'/taxes/'+ this.state.class_tax.id, payload )
      .then(response => {
      })
      .catch(error => console.log(error))
      this.setState({class_tax: payload})
      this.setState({showUpdateTax:false})
      } 
    }
  } 

  renderTaxView(){
    if(this.state.classHasTaxes)
    {
      return(
        this.hasTaxes()
      )
    }

    else{
      return(
        this.hasNoTaxes()
      )
    }
  }

  hasTaxes(){
    return(
      <Col>
        <h4>{this.state.class_name} Taxes {this.state.class_tax.id}</h4>
        <ListGroup>
          <ListGroup.Item key={1} action onClick={() => this.taxClickedItem("Flat Tax")}>Flat Tax {this.state.class_tax.flat_tax}</ListGroup.Item>
          <ListGroup.Item key={2} action onClick={() => this.taxClickedItem("Percentage Tax")}>Percentage Tax {this.state.class_tax.percentage_tax}</ListGroup.Item>
          <ListGroup.Item key={3} action onClick={() => this.taxClickedItem("Progressive Tax")}>Progressive Tax</ListGroup.Item>
          <ListGroup.Item key={4} action onClick={() => this.taxClickedItem("Regressive Tax")}>Regressive Tax</ListGroup.Item>
        </ListGroup>
        {this.renderUpdateEasyTax()}
      </Col>
    );
  }

  hasNoTaxes(){
    return (
      <Col>
        <h4>This class has no taxes</h4>
        <Button variant="primary" onClick={() => this.setState({showCreateTaxes: true})}>
          Set Up Taxes
        </Button>
        {this.createTaxesModal()}
      </Col>
    );
  }

  progBracketClicked(text){
    if( text === 'plus'){
      this.setState({progAmount: this.state.progAmount+1})
    }
    else if(text === 'minus'){
      if(this.state.progAmount !== 0)
      {
        this.setState({progAmount: this.state.progAmount-1})
      }
    }
  }

  regBracketClicked(text){
    if( text === 'plus'){
      this.setState({regAmount: this.state.regAmount+1})
    }
    else if(text === 'minus'){
      if(this.state.regAmount !== 0){
        this.setState({regAmount: this.state.regAmount-1})
      }
    }
  }

  renderAmount(type){
    var ar = []
    if(type === 'prog'){
      for (let i = 0; i<=this.state.progAmount-1; i++){
        ar.push(this.renderBracket(i, type))
      }
    }
    else if(type === 'reg'){
      for (let i = 0; i<=this.state.regAmount-1; i++){
        ar.push(this.renderBracket(i, type))
      }
    }
    return ar
  }

  onUpdateLowChange(e, i, type){
    var text = e.target.value
    if(type === 'prog'){
      var tempAr = this.state.arOfLows
      tempAr[i] = text
      this.setState({arOfLows:tempAr})
      this.setState({ current_low: text });
    }
    else if(type === 'reg'){
      tempAr = this.state.regArOfLows
      tempAr[i] = text
      this.setState({regArOfLows:tempAr})
      this.setState({ current_low: text });
    }
    
  }

  onUpdateHighChange(e, i, type){
    var text = e.target.value
    if(type === 'prog'){
      var tempAr = this.state.arOfHighs
      tempAr[i] = text
      this.setState({arOfHighs:tempAr})
      this.setState({ current_high: text });
    }
    else if(type === 'reg'){
      tempAr = this.state.regArOfHighs
      tempAr[i] = text
      this.setState({regArOfHighs:tempAr})
      this.setState({ current_high: text });
    }
  }

  onUpdatePerChange(e, i, type){
    var text = e.target.value
    if(type === 'prog'){
      var tempAr = this.state.arOfPer
      tempAr[i] = text
      this.setState({arOfPer:tempAr})
      this.setState({ current_per: text });
    }
    else if(type === 'reg'){
      tempAr = this.state.regArOfPer
      tempAr[i] = text
      this.setState({regArOfPer:tempAr})
      this.setState({ current_per: text });
    }  
  }

  setUpTax(){
    if(this.setupIsValid()){
      axios.post(getIP()+'/taxes/', {
        class_code: this.state.class_code,
        sales_tax: this.state.current_sales_tax,
        percentage_tax: this.state.current_percent_tax,
        flat_tax: this.state.current_flat_tax,
      })
      .then(response => {
        for(let i=0; i<=this.state.progAmount-1;i++){
          axios.post(getIP()+'/progressivebrackets/', {
            tax_id: response.data.id,
            lower_bracket: this.state.arOfLows[i],
            higher_bracket: this.state.arOfHighs[i],
            percentage: this.state.arOfPer[i],
          })
          .then(response => {
            this.getTaxes()
          })
          .catch(error => console.log(error))
        }
        for(let i=0; i<=this.state.regAmount-1;i++){
          axios.post(getIP()+'/regressivebrackets/', {
            tax_id: response.data.id,
            lower_bracket: this.state.regArOfLows[i],
            higher_bracket: this.state.regArOfHighs[i],
            percentage: this.state.regArOfPer[i],
          })
          .then(response => {
            this.getTaxes()
          })
          .catch(error => console.log(error))
        }
        this.getTaxes()
        this.setState({showCreateTaxes: false})
      })
      .catch(error => console.log(error))
    }
  }

  renderBracket(i, type){
    return(
      <Row key={i} >
        <Col xs={6} md={4}>
          <FloatingLabel label="Low" className="modal-input">
            <FormControl placeholder="Low" defaultValue={this.defaultLowValue(i, type)} onChange={(e) => this.onUpdateLowChange(e, i, type)}/>
          </FloatingLabel>
        </Col>
        <Col xs={6} md={4}>
          <FloatingLabel label="High" className="modal-input">
            <FormControl placeholder="High" defaultValue={this.defaultHighValue(i, type)} onChange={(e) => this.onUpdateHighChange(e, i, type)}/>
          </FloatingLabel>
        </Col>
        <Col xs={6} md={4}>
          <FloatingLabel label="%" className="modal-input">
            <FormControl placeholder="%" defaultValue = {this.defaultPerValue(i, type)} onChange={(e) => this.onUpdatePerChange(e, i, type)}/>
          </FloatingLabel>
        </Col>
      </Row>
    )
  }

  defaultLowValue(i, type){
    if(type === "prog")
    {
      return this.state.arOfLows[i]
    }
    else if(type === "reg")
    {
      return this.state.regArOfLows[i]
    }
  }

  defaultHighValue(i, type){
    if(type === "prog")
    {
      return this.state.arOfHighs[i]
    }
    else if(type === "reg")
    {
      return this.state.regArOfHighs[i]
    }
  }

  defaultPerValue(i, type){
    if(type === "prog")
    {
      return this.state.arOfPer[i]
    }
    else if(type === "reg")
    {
      return this.state.regArOfPer[i]
    }
  }

  getAllBrackets(){
    axios.get(getIP()+'/progressivebrackets/')
    .then(response => {
        this.getClassProgressiveBrackets(response.data)
        axios.get(getIP()+'/regressivebrackets/')
        .then(response => {
          this.getClassRegressiveBrackets(response.data)
        })
        .catch(error => console.log(error))  
    })
    .catch(error => console.log(error))  
  }

  getClassProgressiveBrackets(brackets){
    var tempar = []
    for(let i = 0; i<=Object.keys(brackets).length -1; i++){
      if(brackets[i].tax_id === this.state.class_tax.id){
        tempar.push(brackets[i])
      }
    }
    this.progArraySetUp(tempar)
    this.setState({class_prog_brackets: tempar})
    this.setState({progAmount: tempar.length})
  }

  getClassRegressiveBrackets(brackets){
    var tempar = []
    for(let i = 0; i<=Object.keys(brackets).length -1; i++){
      if(brackets[i].tax_id === this.state.class_tax.id){
        tempar.push(brackets[i])
      }
    }
    this.regArraySetUp(tempar)
    this.setState({class_reg_brackets: tempar})
    this.setState({regAmount: tempar.length})
  }

  progArraySetUp(ar){
    for(let i =0; i <= Object.keys(ar).length -1;i++){
      var tempHighAr = this.state.arOfHighs
      tempHighAr[i] = ar[i].higher_bracket
      this.setState({arOfHighs:tempHighAr})

      var tempLowAr = this.state.arOfLows
      tempLowAr[i] = ar[i].lower_bracket
      this.setState({arOfLows:tempLowAr})

      var tempPerAr = this.state.arOfPer
      tempPerAr[i] = ar[i].percentage
      this.setState({arOfPer: tempPerAr})

      var tempIdAr = this.state.progArOfId
      tempIdAr[i] = ar[i].id
      this.setState({progArOfId:tempIdAr})
    }
  }

  regArraySetUp(ar){
    for(let i =0; i <= Object.keys(ar).length -1;i++){
      var tempHighAr = this.state.regArOfHighs
      tempHighAr[i] = ar[i].higher_bracket
      this.setState({regArOfHighs:tempHighAr})

      var tempLowAr = this.state.regArOfLows
      tempLowAr[i] = ar[i].lower_bracket
      this.setState({regArOfLows:tempLowAr})

      var tempPerAr = this.state.regArOfPer
      tempPerAr[i] = ar[i].percentage
      this.setState({regArOfPer: tempPerAr})

      var tempIdAr = this.state.regArOfId
      tempIdAr[i] = ar[i].id
      this.setState({regArOfId:tempIdAr})
    }
  }

  updateBrackets(tax_type){
    if(tax_type === "Progressive Tax")
    {
      if(this.progressive_taxes_isValid()){
        for(let i = 0; i<= Object.keys(this.state.progArOfId).length-1; i++){
          axios.put(getIP()+'/progressivebrackets/'+ this.state.progArOfId[i], {
            tax_id: this.state.class_tax.id,
            lower_bracket: this.state.arOfLows[i],
            higher_bracket: this.state.arOfHighs[i],
            percentage: this.state.arOfPer[i], 
          })
          .then(response => {
            this.setState({showUpdateTax: false})
          })
          .catch(error => console.log(error))  
        }
      }
    }
    else if(tax_type === "Regressive Tax")
    {
      if(this.regressive_taxes_isValid()){
        for(let i = 0; i<= Object.keys(this.state.regArOfId).length-1; i++){
          axios.put(getIP()+'/regressivebrackets/'+ this.state.regArOfId[i], {
            tax_id: this.state.class_tax.id,
            lower_bracket: this.state.regArOfLows[i],
            higher_bracket: this.state.regArOfHighs[i],
            percentage: this.state.regArOfPer[i], 
          })
          .then(response => {
            this.setState({showUpdateTax: false})
          })
          .catch(error => console.log(error))  
        }
      }
    }
  }

  validateItem(){
    if(this.state.item_name !== '')
    {
        if(!isNaN(this.state.item_price))
        {
            if(Math.sign(parseFloat(this.state.item_price)) === 1)
            {
                if(this.state.item_desc)
                {
                    return true
                }
                else
                {
                    this.setState({store_error: "Please enter a valid item description"})
                }
            }
            else
            {
                this.setState({store_error: "Please enter a valid item price"})
            }
        }
        else
        {
            this.setState({store_error: "Please enter a number"})
        }
        
        
    }
    else
    {
        this.setState({store_error: "Please enter a valid item name"})
    }
}

  validateBank(){
    if(this.state.interest_rate !== '')
    {
      if(this.state.payout_rate !== '')
      {
        if(!isNaN(this.state.interest_rate))
        {
          if(parseFloat(this.state.interest_rate) > 0 && parseFloat(this.state.interest_rate) < 100)
          {
            if(!isNaN(this.state.payout_rate))
            {
                return true
            }
            else
            {
                this.setState({bank_error: "Please enter a number for payout rate"})
            }
          }
          else
          {
              this.setState({bank_error: "Please enter a valid interest rate percentage"})
          }
        }
        else
        {
            this.setState({bank_error: "Please enter a valid interest rate"})
        }
      }
      else
      {
          this.setState({bank_error: "Please enter a payout rate"})
      }
    }
    else
    {
        this.setState({bank_error: "Please enter an interest rate"})
    }
  }

  setupIsValid(){
    if(this.flat_tax_isValid(this.state.current_flat_tax)){
      if(this.percentage_tax_isValid(this.state.current_percent_tax)){
        if(this.sales_tax_isValid(this.state.current_sales_tax)){
          if(this.regressive_taxes_isValid()){
            if(this.progressive_taxes_isValid()){
              return true
            }
          }
        }
      }
    }
  }

  flat_tax_isValid(flat_tax){
    if(isNaN(flat_tax)){
      this.setState({tax_error: 'Make sure to that flat tax is a number'})
      return false
    }
    else{
      if(Math.sign(flat_tax) === 1){
        return true
      }
      else{
        this.setState({tax_error: 'Make sure to that flat tax is a positive number'})
        return false
      }
    }
  }

  percentage_tax_isValid(percentage_tax){
    if(isNaN(percentage_tax)){
      this.setState({tax_error: 'Make sure to that percentage tax is a number'})
      return false
    }
    else{
      if( parseInt(percentage_tax)>100){
        this.setState({tax_error: 'Make sure to that percentage tax is below 100'})
        return false
      }
      else{
        if(Math.sign(percentage_tax) === 1){
          return true
        }
        else{
          this.setState({tax_error: 'Make sure to that percentage tax is a positive number'})
          return false
        }
      }
    }
  }

  sales_tax_isValid(sale_tax){
    if(isNaN(sale_tax)){
      this.setState({tax_error: 'Make sure to that sales tax is a number'})    
      return false
    }
    else{
      if( parseInt(sale_tax)>100){
        this.setState({tax_error: 'Make sure to that sales tax is below 100%'})
        return false
      }
      else{
        if(Math.sign(sale_tax) === 1){
          return true
        }
        else{
          this.setState({tax_error: 'Make sure to that sales tax is a positive number'})
          return false
        }
      }
    }
  }

  progressive_taxes_isValid(){
    var status = true
    for(let i = 0; i <= Object.keys(this.state.arOfLows).length-1; i++ ){
        if (!this.checkIfNumValid(this.state.arOfLows[i])){
          status = false
        }

        if (!this.checkIfNumValid(this.state.arOfHighs[i])){
          status = false
        }

        if (!this.checkIfNumValid(this.state.arOfPer[i])){
          status = false
        }
    }
    return status
}

regressive_taxes_isValid(){
  var status = true
  for(let i = 0; i <= Object.keys(this.state.regArOfLows).length-1; i++ ){
    if (!this.checkIfNumValid(this.state.regArOfLows[i])){
      status = false
    }
    if (!this.checkIfNumValid(this.state.regArOfHighs[i])){
      status = false
    }
    if (!this.checkIfNumValid(this.state.regArOfPer[i])){
      status = false
    }
  }
  return status
  }

  checkIfNumValid(num){
    if(isNaN(num)){
      this.setState({tax_error: 'Make sure to that brackets only include numbers'})
      return false
    }
    else{
      if(Math.sign(num) === 1){
        return true
      }
      else{
        this.setState({tax_error: 'Make sure to that the brackets only contain positive numbers'})
        return false
      }
    }
  }

  createNewBank(){
    if(this.validateBank())
    {
      axios.post(getIP()+'/banks/', {
        class_code: this.state.class_code,
        interest_rate: this.state.interest_rate,
        payout_rate: this.state.payout_rate,
      })
      .then(response => {
        this.setState({bankModalShow: false})
        this.getBanks()
      })
      .catch(error => console.log(error))
    }
  }

  updateBankRates(){
    if(this.validateBank())
     {
      axios.put(getIP()+'/banks/' + this.state.bank_id, {
        class_code: this.state.class_code,
        interest_rate: this.state.interest_rate,
        payout_rate: this.state.payout_rate,
      })
      .then(response => {
        this.setState({updateBankModalShow:false})
      })
      .catch(error => console.log(error))
    }
 }

  createBankModal() {
    return (
      <Modal
        show={this.state.bankModalShow}
        onHide={() => this.setState({bankModalShow: false})}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Create A Bank
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Bank Interest Rate" className="modal-input">
            <FormControl id='interest_rate' placeholder="Interest Rate" onChange={this.handleChange}/>
          </FloatingLabel>
          <FloatingLabel label="Bank Payout Rate in Weeks" className="modal-input">
            <FormControl id='payout_rate' placeholder="Payout Rate" onChange={this.handleChange} />
          </FloatingLabel>
          <p>{this.state.bank_error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-btn" onClick={() => this.createNewBank()}>Create Bank</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  updateBankModal() {
    return (
      <Modal
        show={this.state.updateBankModalShow}
        onHide={() => this.setState({updateBankModalShow: false})}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Update Bank
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Bank Interest Rate" className="modal-input">
            <FormControl id='interest_rate' placeholder="Interest Rate" defaultValue={this.state.interest_rate} onChange={this.handleChange}/>
          </FloatingLabel>
          <FloatingLabel label="Bank Payout Rate in Weeks" className="modal-input">
            <FormControl id='payout_rate' placeholder="Payout Rate" defaultValue={this.state.payout_rate} onChange={this.handleChange} />
          </FloatingLabel>
          <p>{this.state.bank_error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-btn" onClick={() => this.updateBankRates()}>Update Bank</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  createStoreModal(){
    return (
      <Modal
        show={this.state.showCreateStore}
        onHide={() => this.setState({showCreateStore: false})}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Create A Store
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Store Name" className="modal-input">
            <FormControl id='store_name' placeholder="Interest Rate" onChange={this.handleChange}/>
          </FloatingLabel>
          <p>{this.state.store_error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-btn" onClick={() => this.createNewStore()}>Create Store</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  addItemModal(){
    return (
      <Modal
        show={this.state.showAddItem}
        onHide={() => this.setState({showAddItem: false})}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add An Item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} md={8}>
                <FloatingLabel label="Item Name" className="modal-input">
                  <FormControl id='item_name' placeholder="Item Name" onChange={this.handleChange}/>
                </FloatingLabel>
              </Col>
              <Col xs={6} md={4}>
                <FloatingLabel label="Item Price" className="modal-input">
                  <FormControl id='item_price' placeholder="Item Price" onChange={this.handleChange}/>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <FloatingLabel label="Item Description" className="modal-input">
                <FormControl id='item_desc' placeholder="Item Description" onChange={this.handleChange} />
              </FloatingLabel>
            </Row>
          </Container>
          <p>{this.state.store_error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-btn" onClick={() => this.addItem()}>Add Item</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  updateItemModal()
  {
    return (
      <Modal
        show={this.state.showUpdateItem}
        onHide={() => this.setState({showUpdateItem: false})}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Update An Item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} md={8}>
                <FloatingLabel label="Item Name" className="modal-input">
                  <FormControl id='item_name' placeholder="Item Name" defaultValue={this.state.item_name} onChange={this.handleChange}/>
                </FloatingLabel>
              </Col>
              <Col xs={6} md={4}>
                <FloatingLabel label="Item Price" className="modal-input">
                  <FormControl id='item_price' placeholder="Item Price" defaultValue={this.state.item_price} onChange={this.handleChange}/>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <FloatingLabel label="Item Description" className="modal-input">
                <FormControl id='item_desc' placeholder="Item Description" defaultValue={this.state.item_desc} onChange={this.handleChange} />
              </FloatingLabel>
            </Row>
          </Container>
          <p>{this.state.store_error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-btn" onClick={() => this.updateItem()}>Update Item</Button>
          <Button className="modal-btn" onClick={() => this.deleteItem()}>Delete Item</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  importStoreItemsModal(){
    return (
      <Modal
        show={this.state.showImportItems}
        onHide={() => this.setState({showImportItems: false})}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Import Items from Another Class Store
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Class Code" className="modal-input">
            <FormControl id='item_import_class_code' placeholder="Class Code" onChange={this.handleChange}/>
          </FloatingLabel>
          <p>{this.state.store_error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-btn" onClick={() => this.importStoreItems()}>Import Items</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  createTaxesModal(){
    return (
      <Modal
        show={this.state.showCreateTaxes}
        onHide={() => this.setState({showCreateTaxes: false})}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Set Up Taxes
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={6} md={4}>
                <FloatingLabel label="Flat Tax" className="modal-input">
                  <FormControl id='current_flat_tax' placeholder="Flat Tax" onChange={this.handleChange}/>
                </FloatingLabel>
              </Col>
              <Col xs={6} md={4}>
                <FloatingLabel label="Percent Tax" className="modal-input">
                  <FormControl id='current_percent_tax' placeholder="Percent Tax" onChange={this.handleChange}/>
                </FloatingLabel>
              </Col>
              <Col xs={6} md={4}>
                <FloatingLabel label="Sales Tax" className="modal-input">
                  <FormControl id='current_sales_tax' placeholder="Sales Tax" onChange={this.handleChange}/>
                </FloatingLabel>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col>
              <h5> Progressive Taxes </h5>
              </Col>
              <Col className="tax-btn-col">
                <Button variant="outline-secondary" onClick={() => this.progBracketClicked("plus")}>+</Button>
                &nbsp;
                <Button variant="outline-secondary" onClick={() => this.progBracketClicked("minus")}>-</Button>
              </Col>
              {this.renderAmount('prog')}
            </Row>
            <br></br>
            <Row>
              <Col>
              <h5> Regressive Taxes </h5>
              </Col>
              <Col className="tax-btn-col">
                <Button variant="outline-secondary" onClick={() => this.regBracketClicked("plus")}>+</Button>
                &nbsp;
                <Button variant="outline-secondary" onClick={() => this.regBracketClicked("minus")}>-</Button>
              </Col>
              {this.renderAmount('reg')}
            </Row>
          </Container>
          <p>{this.state.tax_error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-btn" onClick={() => {this.setUpTax()}}>Create Taxes</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderUpdateEasyTax(){
    if(this.state.current_tax_type === "Flat Tax" || this.state.current_tax_type === "Percentage Tax")
    {
      return (
        <Modal
          show={this.state.showUpdateTax}
          onHide={() => this.setState({showUpdateTax: false})}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Update {this.state.current_tax_type}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel label={this.state.current_tax_type} className="modal-input">
              <FormControl id={this.state.form_id} placeholder={this.state.current_tax_type} defaultValue={this.state.current_value} onChange={this.handleChange}/>
            </FloatingLabel>
            <p>{this.state.tax_error}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button className="modal-btn" onClick={() => this.updateEasyTax(this.state.current_tax_type)}>Update Tax</Button>
          </Modal.Footer>
        </Modal>
      );
    }
    else if(this.state.current_tax_type === "Progressive Tax")
    {
      return(
        <Modal
          show={this.state.showUpdateTax}
          onHide={() => this.setState({showUpdateTax: false})}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Update {this.state.current_tax_type}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Row>
                <Col>
                <h5> Progressive Taxes </h5>
                </Col>
                <Col className="tax-btn-col">
                  <Button variant="outline-secondary" onClick={() => this.progBracketClicked("plus")}>+</Button>
                  &nbsp;
                  <Button variant="outline-secondary" onClick={() => this.progBracketClicked("minus")}>-</Button>
                </Col>
                {this.renderAmount('prog')}
              </Row>
              </Modal.Body>
          <Modal.Footer>
            <Button className="modal-btn" onClick={() => this.updateBrackets(this.state.current_tax_type)}>Update Tax</Button>
          </Modal.Footer>
        </Modal>
      );
    }
    else if(this.state.current_tax_type === "Regressive Tax")
    {
      return(
        <Modal
          show={this.state.showUpdateTax}
          onHide={() => this.setState({showUpdateTax: false})}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Update {this.state.current_tax_type}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Row>
            <Col>
            <h5> Regressive Taxes </h5>
            </Col>
            <Col className="tax-btn-col">
              <Button variant="outline-secondary" onClick={() => this.regBracketClicked("plus")}>+</Button>
              &nbsp;
              <Button variant="outline-secondary" onClick={() => this.regBracketClicked("minus")}>-</Button>
            </Col>
            {this.renderAmount('reg')}
          </Row>
              </Modal.Body>
          <Modal.Footer>
            <Button className="modal-btn" onClick={() => this.updateBrackets(this.state.current_tax_type)}>Update Tax</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }



  render() {
    if(this.state.redirect_profile){
      return(
        <Redirect to={{
          pathname: '/Profile', 
          state: { role: "Teacher" }}}>
      </Redirect>
      )
    }
    else{
      return (
        <Container className="class-container">
          <Row className="header-row">
          <h3>Class: {this.state.class_name}</h3>
          </Row>
          <Row className="header-btn-row">
          <Button variant="outline-primary" className="back-btn" onClick={this.handleProfileRedirect}> Go Back</Button>
          </Row>
          <Row className="content-row">
            <Col>
              <h4>Students</h4>
              <ListGroup>
                {this.state.students.map((student,i) => this.renderStudents(student, i))}
              </ListGroup>
              <InputGroup className="amount-input">
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl defaultValue="0" id='amount' onChange={this.handleChange} />
              </InputGroup>
              <p>{this.state.error}</p>
              <Button className="pay-btns" onClick={() => this.changeSelected(true)}>Pay Selected Students</Button>
              <Button className="pay-btns" onClick={() => this.changeSelected(false)}>Charge Selected Students</Button>
            </Col>
            <Col xs={7}>
              <Row className="taxes-row">
                {this.renderTaxView()}
              </Row>
              <Row className="store-row">
                {this.renderShopView()}
              </Row>
              <Row className="bank-row">
                {this.renderBankView()}
              </Row>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default withRouter(TeacherClassApp)