import React from 'react';
import {connect} from 'react-redux';
import requiresLogin from './requires-login';
import {fetchProtectedData} from '../actions/protected-data';
import {hideLoginForm} from '../actions/useractions';
import {hideRegistrationForm} from '../actions/useractions';
import {fetchQuestion} from '../actions/questions';
import {buttonToggle} from '../actions/questions';
import {buttonToggleBack} from '../actions/questions';
import {checkAnswer} from '../actions/questions';

import './dashboard.css';

export class Dashboard extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchProtectedData());
        this.props.dispatch(hideLoginForm());
        this.props.dispatch(hideRegistrationForm());
        this.props.dispatch(fetchQuestion(this.props.userId));
    }

    render() {
      let correctPercent = this.props.questionCorrect * 100;
      let totalPercent = this.props.questionTotal * 100;
      let scorePercent = this.props.score * 100;
      let attemptPercent = this.props.attempts * 100;

      let indivQuestionPercent;
      if (this.props.score) {
        indivQuestionPercent = Math.round((scorePercent / attemptPercent) * 100);
      }

      let percentResult;
      if (totalPercent) {
        percentResult = Math.round((correctPercent / totalPercent) * 100);
      }
   
      // console.log('user id is: ', this.props.userId);
      let cardCall = this.props.currentQuestion;
      let questionFeedback = this.props.answerFeedback;
      let incorrectFeedback;

      if (this.props.answerFeedback === 'Incorrect!') {
        incorrectFeedback = 'Youll see this question more often';
      }

        if (!this.props.buttonToggle) {
        return (
          <section className="dashboard-wrapper">
              <div className="flashcard-wrapper">
              <div className="counter-wrapper">
              <li>Total accuracy: {percentResult}% </li>
              </div>
              <h1 className="card-header">{cardCall}</h1>
              <form className="search-form" onSubmit = { (e) => {
                e.preventDefault();
                this.props.dispatch(checkAnswer(this.input.value));
                this.props.dispatch(buttonToggle(this.props.isCorrect));
              }}>
              <label className="answer-label"htmlFor="search">Translation:</label>
              <input className="search-input" type="search" ref={input => (this.input = input)} />
              <button type="submit" className="search-button btn-gradient orange">Check Answer</button>
              </form>
              </div>
          </section>
          );
        }
        else if (this.props.buttonToggle) {
          return (
            <section className="dashboard-wrapper">
                <div className="flashcard-wrapper">
                <h1 className="card-header">{questionFeedback}</h1>
                <h2>{incorrectFeedback}</h2>
                <p>Accuracy for {this.props.currentQuestion} : {indivQuestionPercent}%</p>
                <form className="search-form next-form" onSubmit = { (e) => {
                  e.preventDefault();
                }}>
                <button type="button" onClick={() => this.props.dispatch(buttonToggleBack(this.props.isCorrect, this.props.userId))} className="search-button btn-gradient orange next">Next Question</button>
                </form>
                </div>
            </section>
      );
      }  
    }
}

const mapStateToProps = state => {
    const {currentUser} = state.auth;
    return {
        username: state.auth.currentUser.username,
        userId: state.auth.currentUser.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        protectedData: state.protectedData.data,
        buttonToggle: state.questionReducer.btnToggle,
        currentQuestion: state.questionReducer.currentQuestion,
        isCorrect: state.questionReducer.isCorrect,
        answerFeedback: state.questionReducer.answerFeedback,
        questionCorrect: state.questionReducer.questionCorrect,
        questionTotal: state.questionReducer.questionTotal,
        score: state.questionReducer.score,
        attempts: state.questionReducer.attempts
    };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
