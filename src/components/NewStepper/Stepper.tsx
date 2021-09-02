import React, { ReactElement } from 'react'
import StepperMUI from '@material-ui/core/Stepper'
import StepMUI from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/'

import Hairline from '../layout/Hairline'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { boldFont, lg, sm } from 'src/theme/variables'
import { StepperProvider, useStepper } from './stepperContext'

type StepperProps = {
  children: ReactElement[]
  onFinish?: () => void
  disableNextButton?: boolean
  nextButtonType?: string
}

function StepperComponent(): ReactElement {
  const {
    currentStep,
    setCurrentStep,
    steps,

    isFirstStep,

    onClickPreviousStep,
    onClickNextStep,

    disableNextButton,
    nextButtonType,
    customNextButtonLabel,

    CurrentStepComponent,
  } = useStepper()

  const backButtonLabel = isFirstStep ? 'Cancel' : 'Back'
  const nextButtonLabel = customNextButtonLabel || 'Next'

  return (
    <StepperMUI activeStep={currentStep} orientation="vertical">
      {steps.map(function Step(step, index) {
        const isStepLabelClickable = currentStep > index
        const classes = useStyles({ isStepLabelClickable })

        function onClickLabel() {
          if (isStepLabelClickable) {
            setCurrentStep(index)
          }
        }

        return (
          <StepMUI key={step.props.label}>
            <StepLabel onClick={onClickLabel} className={classes.stepLabel}>
              {step.props.label}
            </StepLabel>
            <StepContent>
              <Paper className={classes.root} elevation={1}>
                {CurrentStepComponent}
                <Hairline />
                <Row align="center" grow className={classes.controlStyle}>
                  <Col center="xs" xs={12}>
                    <Button onClick={onClickPreviousStep} size="small" className={classes.backButton} type="button">
                      {backButtonLabel}
                    </Button>
                    <Button
                      onClick={onClickNextStep}
                      color="primary"
                      type={nextButtonType || 'button'}
                      disabled={disableNextButton || step.props.disableNextButton}
                      size="small"
                      className={classes.nextButton}
                      variant="contained"
                    >
                      {nextButtonLabel}
                    </Button>
                  </Col>
                </Row>
              </Paper>
            </StepContent>
          </StepMUI>
        )
      })}
    </StepperMUI>
  )
}

export default function Stepper(props: StepperProps): ReactElement {
  return (
    <StepperProvider stepsComponents={props.children} {...props}>
      <StepperComponent />
    </StepperProvider>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '10px 0 10px 10px',
    maxWidth: '770px',
    boxShadow: '0 0 10px 0 rgba(33,48,77,0.10)',
  },
  controlStyle: {
    backgroundColor: 'white',
    padding: lg,
    borderRadius: sm,
  },
  backButton: {
    marginRight: sm,
    fontWeight: boldFont,
    color: theme.palette.secondary.main,
  },
  nextButton: {
    fontWeight: boldFont,
  },
  stepLabel: {
    cursor: ({ isStepLabelClickable }: any) => (isStepLabelClickable ? 'pointer' : 'inherit'),
  },
}))

export type StepElementProps = {
  label: string
  children: JSX.Element
  nextButtonLabel?: string
  nextButtonType?: string
  disableNextButton?: boolean
}

export type StepElementType = (props: StepElementProps) => ReactElement

export function StepElement({ children }: StepElementProps): ReactElement {
  return children
}