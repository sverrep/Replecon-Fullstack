import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import './TeacherTaxes.css';
import navbar from '../../Components/navbar/Teacher NavBar/TeacherNavbar';
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormControl from 'react-bootstrap/FormControl'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Modal from 'react-bootstrap/Modal'

class TeacherTaxes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            class_code: this.props.location.state.class.class_code, 
            class_name: this.props.location.state.class.class_name,
            teacher_id:  this.props.location.state.teacher_id,
            students: [],
            
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
            tax_import_class_code: '',
            tax_import_taxes: [],
            tax_import_prog: [],
            tax_import_reg: [],
            tax_error: '',
            showCreateTaxes: false,
            showUpdateTax: false,
            showImportTaxes: false,
        };
        this.handleChange = this.handleChange.bind(this)
        this.onUpdateLowChange = this.onUpdateLowChange.bind(this)

    }

    handleChange(e) {
        const field = e.target.id
        this.setState({ [field] : e.target.value });
    }

    componentDidMount(){
        this.getClassStudents()
        this.getTaxes("local")
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

    async getTaxes(type){
        await axios.get(getIP()+'/taxes/')
        .then(async (response) => {
            return await this.checkForClassTax(response.data, type)
        })
        .catch(error => console.log(error))
    }

    async checkForClassTax(alltaxes, type){
        if(type === "local")
        {
          for(let i = 0; i <= Object.keys(alltaxes).length -1; i++){
            if(alltaxes[i].class_code === this.state.class_code){
              this.setState({classHasTaxes: true})
              this.setState({class_tax: alltaxes[i]})
              return true
            }
          }
        }
        else if(type === "import")
        {
          for(let i = 0; i <= Object.keys(alltaxes).length -1; i++){
            if(alltaxes[i].class_code === this.state.tax_import_class_code){
              this.setState({tax_import_taxes: alltaxes[i]})
              return true
            }
          }
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
                        this.getTaxes("local")
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
                        this.getTaxes("local")
                    })
                    .catch(error => console.log(error))
                }
                this.getTaxes("local")
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

    updateEasyTax(tax_type){
        var payload = {}
        if(tax_type === 'Flat Tax') 
        {
            if(this.flat_tax_isValid(this.state.current_flat_tax))
            {
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
    
        else if(tax_type === 'Percentage Tax')
        {
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

    getClassProgressiveBrackets(brackets, type){
        var tempar = []
        if (type === "local")
        {
          for(let i = 0; i<=Object.keys(brackets).length -1; i++){
            if(brackets[i].tax_id === this.state.class_tax.id){
              tempar.push(brackets[i])
            }
          }
          this.progArraySetUp(tempar)
          this.setState({class_prog_brackets: tempar})
          this.setState({progAmount: tempar.length})
        }
        else if (type === "import")
        {
          for(let i = 0; i<=Object.keys(brackets).length -1; i++){
            if(brackets[i].tax_id === this.state.tax_import_taxes.id){
              tempar.push(brackets[i])
            }
          }
          this.progArraySetUp(tempar)
          this.setState({tax_import_prog: tempar})
        }
      }
    
    getClassRegressiveBrackets(brackets, type){
        var tempar = []
        if (type === "local")
        {
            for(let i = 0; i<=Object.keys(brackets).length -1; i++){
                if(brackets[i].tax_id === this.state.class_tax.id){
                    tempar.push(brackets[i])
                }
            }
            this.regArraySetUp(tempar)
            this.setState({class_reg_brackets: tempar})
            this.setState({regAmount: tempar.length})
        }
        else if (type === "import")
        {
            for(let i = 0; i<=Object.keys(brackets).length -1; i++){
                if(brackets[i].tax_id === this.state.tax_import_taxes.id){
                    tempar.push(brackets[i])
                }
            }
            this.regArraySetUp(tempar)
            this.setState({tax_import_reg: tempar})
        }
    }

    async getAllBrackets(type){
        await axios.get(getIP()+'/progressivebrackets/')
        .then(async (response) => {
            this.getClassProgressiveBrackets(response.data, type)
            await axios.get(getIP()+'/regressivebrackets/')
            .then(response => {
                this.getClassRegressiveBrackets(response.data, type)
            })
            .catch(error => console.log(error))  
        })
        .catch(error => console.log(error))  
    }

    taxClickedItem(tax_type){
        this.getAllBrackets("local")
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

    hasTaxes(){
        return(
            <Row className="taxes-col">
                <h3>{this.state.class_name} Taxes {this.state.class_tax.id}</h3>
                <ListGroup>
                    <ListGroup.Item key={1} action onClick={() => this.taxClickedItem("Flat Tax")}>Flat Tax {this.state.class_tax.flat_tax}</ListGroup.Item>
                    <ListGroup.Item key={2} action onClick={() => this.taxClickedItem("Percentage Tax")}>Percentage Tax {this.state.class_tax.percentage_tax}</ListGroup.Item>
                    <ListGroup.Item key={3} action onClick={() => this.taxClickedItem("Progressive Tax")}>Progressive Tax</ListGroup.Item>
                    <ListGroup.Item key={4} action onClick={() => this.taxClickedItem("Regressive Tax")}>Regressive Tax</ListGroup.Item>
                </ListGroup>
                {this.renderUpdateEasyTax()}
          </Row>
        );
      }

    hasNoTaxes(){
        return (
            <Row className="taxes-col">
                <h4>This class has no taxes</h4>
                <Button variant="primary" className = "tax-btns" onClick={() => this.setState({showCreateTaxes: true})}>
                    Set Up Taxes
                </Button>
                <Button variant="primary" className = "tax-btns" onClick={() => this.setState({showImportTaxes: true})}>
                    Import Taxes from Another Class
                </Button>
                {this.createTaxesModal()}
                {this.importTaxModal()}
            </Row>
        );
    }

    renderTaxView(){
        if(this.state.classHasTaxes)
        {
            return (
                this.hasTaxes()
            )
        }
        else
        {
            return (
                this.hasNoTaxes()
            )
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

        else {
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
        else {
            if( parseInt(percentage_tax)>100){
                this.setState({tax_error: 'Make sure to that percentage tax is below 100'})
                return false
            }
            else{
                if(Math.sign(percentage_tax) === 1){
                    return true
                }
                else {
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
        else {
            if(Math.sign(num) === 1){
                return true
            }
            else{
                this.setState({tax_error: 'Make sure to that the brackets only contain positive numbers'})
                return false
            }
        }
    }

    async taxTheClass(tax_type){
        var selected = this.state.students
        var payload, prog_amount
        if(tax_type === "Flat Tax"){
            for(let i = 0; i <= Object.keys(selected).length-1; i++)
            {
                payload = { user_id: selected[i].id, amount: '-'+this.state.class_tax.flat_tax }; 
                await axios.put(getIP()+'/students/balance/', payload)
                .then(async response => {
                    await axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": '-'+this.state.class_tax.flat_tax})
                    .then(response => {
                    })
                    .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
            }
        }
    
        else if(tax_type === "Percentage Tax"){
            for(let i = 0; i <= Object.keys(selected).length-1; i++)
            {
                var percentamount = (selected[i].balance * (this.state.class_tax.percentage_tax/100)).toFixed(2)
                payload = { user_id: selected[i].id, amount: "-"+percentamount }; 
                await axios.put(getIP()+'/students/balance/', payload)
                .then(async response => {
                    await axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": "-"+ percentamount})
                    .then(response => {
                    })
                    .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
            }
    
        }
    
        else if(tax_type === "Progressive Tax"){
            for(let i = 0; i <= Object.keys(selected).length-1; i++)
            {   
                prog_amount = (this.getProgressiveTaxAmount(selected[i].balance)).toFixed(2)
                if(prog_amount>0){
                    payload = { user_id: selected[i].id, amount: '-'+prog_amount }; 
                    await axios.put(getIP()+'/students/balance/', payload)
                    .then(async response => {
                        await axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": "-"+prog_amount})
                        .then(response => {
                        })
                        .catch(error => console.log(error))
                    })
                    .catch(error => console.log(error))
                }
            }
        }
    
        else if(tax_type === "Regressive Tax"){
            for(let i = 0; i <= Object.keys(selected).length-1; i++)
            {   
                prog_amount = (this.getRegressiveTaxAmount(selected[i].balance)).toFixed(2)
                if(prog_amount>0){
                    payload = { user_id: selected[i].id, amount: '-'+prog_amount }; 
                    await axios.put(getIP()+'/students/balance/', payload)
                    .then(async response => {
                        await axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": "-"+prog_amount})
                        .then(response => {
                        })
                        .catch(error => console.log(error))
                    })
                    .catch(error => console.log(error))
                }
            }
        }
    }

    getProgressiveTaxAmount(balance){
        var tax = 0;
        for(let i = 0; i<=Object.keys(this.state.class_prog_brackets).length-1;i++){
            var am = 0
            if(balance>=this.state.class_prog_brackets[i].higher_bracket){
                am = (this.state.class_prog_brackets[i].higher_bracket - this.state.class_prog_brackets[i].lower_bracket) * (this.state.class_prog_brackets[i].percentage/100)
            }
    
            else if(balance<=this.state.class_prog_brackets[i].higher_bracket && balance>this.state.class_prog_brackets[i].lower_bracket){
                am = (balance - this.state.class_prog_brackets[i].lower_bracket) * (this.state.class_prog_brackets[i].percentage/100)
            }
            tax = tax + am
            
        }
        return tax
    }

    getRegressiveTaxAmount(balance){
        var tax = 0;
        for(let i = 0; i<=Object.keys(this.state.class_reg_brackets).length-1;i++){
            var am = 0
            if(balance>=this.state.class_reg_brackets[i].higher_bracket){
                am = (this.state.class_reg_brackets[i].higher_bracket - this.state.class_reg_brackets[i].lower_bracket) * (this.state.class_reg_brackets[i].percentage/100)
            }
    
            else if(balance<=this.state.class_reg_brackets[i].higher_bracket && balance>this.state.class_reg_brackets[i].lower_bracket){
                am = (balance - this.state.class_reg_brackets[i].lower_bracket) * (this.state.class_reg_brackets[i].percentage/100)
            }
            tax = tax + am
            
        }
        return tax
    }

    importTaxes(){
        axios.get(getIP()+'/classrooms/')
        .then(async (response) => {
          for(let i = 0; i <= Object.keys(response.data).length - 1; i++){
            if(this.state.tax_import_class_code === response.data[i].class_code)
            {
              await this.getTaxes("import")
              await this.getAllBrackets("import")
              axios.post(getIP()+'/taxes/', {
                class_code: this.state.class_code,
                sales_tax: this.state.tax_import_taxes.sales_tax,
                percentage_tax: this.state.tax_import_taxes.percentage_tax,
                flat_tax: this.state.tax_import_taxes.flat_tax,
              })
              .then(async (response) => {
                for(let i=0; i<=this.state.tax_import_prog.length-1;i++){
                  console.log("prog")
                  await axios.post(getIP()+'/progressivebrackets/', {
                    tax_id: response.data.id,
                    lower_bracket: this.state.arOfLows[i],
                    higher_bracket: this.state.arOfHighs[i],
                    percentage: this.state.arOfPer[i],
                  })
                  .then(response => {
                    console.log(response.data)
                    this.getTaxes("local")
                  })
                  .catch(error => console.log(error))
                }
                for(let i=0; i<=this.state.tax_import_reg.length-1;i++){
                  console.log("reg")
                  await axios.post(getIP()+'/regressivebrackets/', {
                    tax_id: response.data.id,
                    lower_bracket: this.state.regArOfLows[i],
                    higher_bracket: this.state.regArOfHighs[i],
                    percentage: this.state.regArOfPer[i],
                  })
                  .then(async (response) => {
                    console.log(response.data)
                    this.getTaxes("local")
                  })
                  .catch(error => console.log(error))
                }
                this.getTaxes("local")
                this.setState({showImportTaxes: false})
              
              })
            }
          }
        })
        .catch(error => console.log(error))
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
                <Button className="tax-btns" onClick={() => this.updateEasyTax(this.state.current_tax_type)}>Update Tax</Button>
                <Button className="tax-btns" onClick={() => this.taxTheClass(this.state.current_tax_type)}>Tax The Class</Button>
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
                <Button className="tax-btns" onClick={() => this.updateBrackets(this.state.current_tax_type)}>Update Tax</Button>
                <Button className="tax-btns" onClick={() => this.taxTheClass(this.state.current_tax_type)}>Tax The Class</Button>
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
                <Button className="tax-btns" onClick={() => this.updateBrackets(this.state.current_tax_type)}>Update Tax</Button>
                <Button className="tax-btns" onClick={() => this.taxTheClass(this.state.current_tax_type)}>Tax The Class</Button>
              </Modal.Footer>
            </Modal>
          );
        }
      }
    
      importTaxModal(){
        return (
          <Modal
            show={this.state.showImportTaxes}
            onHide={() => this.setState({showImportTaxes: false})}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Import Taxes from Another Class
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FloatingLabel label="Class Code" className="modal-input">
                <FormControl id='tax_import_class_code' placeholder="Class Code" onChange={this.handleChange}/>
              </FloatingLabel>
              <p>{this.state.store_error}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-btn" onClick={() => this.importTaxes()}>Import Taxes</Button>
            </Modal.Footer>
          </Modal>
        );
      }
    

    render(){
        return (
            <div className="wrapper">
                {navbar(this.state.class_name, {class_code: this.state.class_code, class_name: this.state.class_name}, this.state.teacher_id)}
                <Container className="taxes-container">
                    <Row>
                        {this.renderTaxView()}
                    </Row>
                </Container>
            </div>
        );
    }
}




    export default withRouter(TeacherTaxes)