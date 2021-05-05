import { Checkout as SourceCheckout } from 'SourceRoute/Checkout/Checkout.component';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import CartCoupon from 'Component/CartCoupon';
import CheckoutBilling from 'Component/CheckoutBilling';
import CheckoutGuestForm from 'Component/CheckoutGuestForm';
import CheckoutOrderSummary from 'Component/CheckoutOrderSummary';
import CheckoutShipping from 'Component/CheckoutShipping';
import CheckoutSuccess from 'Component/CheckoutSuccess';
import CmsBlock from 'Component/CmsBlock';
import ContentWrapper from 'Component/ContentWrapper';
import ExpandableContent from 'Component/ExpandableContent';
import { CHECKOUT, CHECKOUT_SUCCESS } from 'Component/Header/Header.config';
import Loader from 'Component/Loader';
import { addressType } from 'Type/Account';
import { paymentMethodsType, shippingMethodsType } from 'Type/Checkout';
import { HistoryType } from 'Type/Common';
import { TotalsType } from 'Type/MiniCart';
import { appendWithStoreCode } from 'Util/Url';

import {
    BILLING_STEP,
    CHECKOUT_URL,
    DETAILS_STEP,
    SHIPPING_STEP
} from './Checkout.config';

import './Checkout.style';






export class Checkout extends SourceCheckout {
    static propTypes = {
        setLoading: PropTypes.func.isRequired,
        setDetailsStep: PropTypes.func.isRequired,
        shippingMethods: shippingMethodsType.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
        paymentMethods: paymentMethodsType.isRequired,
        saveAddressInformation: PropTypes.func.isRequired,
        savePaymentInformation: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isDeliveryOptionsLoading: PropTypes.bool.isRequired,
        shippingAddress: addressType.isRequired,
        billingAddress: addressType.isRequired,
        checkoutTotals: TotalsType.isRequired,
        orderID: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        isEmailAvailable: PropTypes.bool.isRequired,
        history: HistoryType.isRequired,
        onEmailChange: PropTypes.func.isRequired,
        paymentTotals: TotalsType,
        checkoutStep: PropTypes.oneOf([
            SHIPPING_STEP,
            BILLING_STEP,
            DETAILS_STEP
        ]).isRequired,
        isCreateUser: PropTypes.bool.isRequired,
        onCreateUserChange: PropTypes.func.isRequired,
        onPasswordChange: PropTypes.func.isRequired,
        isGuestEmailSaved: PropTypes.bool.isRequired,
        goBack: PropTypes.func.isRequired,
        totals: TotalsType.isRequired,
        isMobile: PropTypes.bool.isRequired,
        onCouponCodeUpdate: PropTypes.func.isRequired
    };

    static defaultProps = {
        paymentTotals: {}
    };

    stepMap = {
        [SHIPPING_STEP]: {
            title: __('Shipping step'),
            url: '/shipping',
            render: this.renderShippingStep.bind(this), 
            areTotalsVisible: true,
            renderCartCoupon: this.renderCartCoupon.bind(this)
        },
        [BILLING_STEP]: {
            title: __('Billing step'),
            url: '/billing',
            render: this.renderBillingStep.bind(this),
            areTotalsVisible: true,
            renderCartCoupon: this.renderCartCoupon.bind(this)
        },
        [DETAILS_STEP]: {
            title: __('Thank you for your purchase!'),
            url: '/success',
            render: this.renderDetailsStep.bind(this),
            areTotalsVisible: false
        }
    };

    componentDidMount() {
        const { checkoutStep, history } = this.props;
        const { url } = this.stepMap[checkoutStep];

        this.updateHeader();

        history.replace(appendWithStoreCode(`${ CHECKOUT_URL }${ url }`));
    }

    componentDidUpdate(prevProps) {
        const { checkoutStep } = this.props;
        const { checkoutStep: prevCheckoutStep } = prevProps;

        if (checkoutStep !== prevCheckoutStep) {
            this.updateHeader();
            this.updateStep();
            this.renderProgressBar()
        }
    }


    updateHeader() {
        const { setHeaderState, checkoutStep, goBack } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        setHeaderState({
            name: checkoutStep === DETAILS_STEP ? CHECKOUT_SUCCESS : CHECKOUT,
            title,
            onBackClick: () => goBack()
        });
    }

    updateStep() {
        const { checkoutStep, history } = this.props;
        const { url } = this.stepMap[checkoutStep];

        history.push(appendWithStoreCode(`${ CHECKOUT_URL }${ url }`));
    }

    renderTitle() {
        const { checkoutStep } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        return (
            <h2 block="Checkout" elem="Title">
                { title }
            </h2>
        );
    }

    renderGuestForm() {
        const {
            checkoutStep,
            isCreateUser,
            onEmailChange,
            onCreateUserChange,
            onPasswordChange,
            isGuestEmailSaved
        } = this.props;
        const isBilling = checkoutStep === BILLING_STEP;

        return (
            <CheckoutGuestForm
              isBilling={ isBilling }
              isCreateUser={ isCreateUser }
              onEmailChange={ onEmailChange }
              onCreateUserChange={ onCreateUserChange }
              onPasswordChange={ onPasswordChange }
              isGuestEmailSaved={ isGuestEmailSaved }
            />
        );
    }

    renderShippingStep() {
        const {
            shippingMethods,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            isDeliveryOptionsLoading,
            onPasswordChange,
            onCreateUserChange,
            onEmailChange,
            isCreateUser
        } = this.props;

        return (
            <CheckoutShipping
              isLoading={ isDeliveryOptionsLoading }
              shippingMethods={ shippingMethods }
              saveAddressInformation={ saveAddressInformation }
              onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
              onPasswordChange={ onPasswordChange }
              onCreateUserChange={ onCreateUserChange }
              onEmailChange={ onEmailChange }
              isCreateUser={ isCreateUser }
            />
        );
    }

    renderBillingStep() {
        const {
            setLoading,
            setDetailsStep,
            shippingAddress,
            paymentMethods = [],
            savePaymentInformation
        } = this.props;

        return (
            <CheckoutBilling
              setLoading={ setLoading }
              paymentMethods={ paymentMethods }
              setDetailsStep={ setDetailsStep }
              shippingAddress={ shippingAddress }
              savePaymentInformation={ savePaymentInformation }
            />
        );
    }

    renderDetailsStep() {
        const {
            orderID,
            isEmailAvailable,
            email,
            billingAddress: {
                firstname,
                lastname
            }
        } = this.props;

        return (
            <CheckoutSuccess
              email={ email }
              firstName={ firstname }
              lastName={ lastname }
              isEmailAvailable={ isEmailAvailable }
              orderID={ orderID }
            />
        );
    }

    renderStep() {
        const { checkoutStep } = this.props;
        const { render } = this.stepMap[checkoutStep];
        if (render) {
            return render();
        }

        return null;
    }

    renderLoader() {
        const { isLoading } = this.props;
        return <Loader isLoading={ isLoading } />;
    }

    renderSummary(showOnMobile = false) {
        const {
            checkoutTotals,
            checkoutStep,
            paymentTotals,
            isMobile,
            totals: { coupon_code },
            onCouponCodeUpdate
        } = this.props;
        const { areTotalsVisible } = this.stepMap[checkoutStep];

        if (!areTotalsVisible || (showOnMobile && !isMobile) || (!showOnMobile && isMobile)) {
            return null;
        }

        return (
            <CheckoutOrderSummary
              checkoutStep={ checkoutStep }
              totals={ checkoutTotals }
              paymentTotals={ paymentTotals }
              isExpandable={ isMobile }
              couponCode={ coupon_code }
              // eslint-disable-next-line react/jsx-no-bind
              renderCmsBlock={ () => this.renderPromo(true) }
              onCouponCodeUpdate={ onCouponCodeUpdate }
            />
        );
    }

    renderCoupon() {
        const { checkoutStep } = this.props;
        const { renderCartCoupon } = this.stepMap[checkoutStep];

        if (renderCartCoupon) {
            return renderCartCoupon();
        }

        return null;
    }

    renderCartCoupon() {
        const {
            totals: { coupon_code },
            isMobile,
            onCouponCodeUpdate,
            checkoutStep
        } = this.props;

        if (isMobile || checkoutStep === SHIPPING_STEP) {
            return null;
        }

        return (
            <ExpandableContent
              heading={ __('Have a discount code?') }
              mix={ { block: 'Checkout', elem: 'Coupon' } }
            >
                <CartCoupon
                  couponCode={ coupon_code }
                  onCouponCodeUpdate={ onCouponCodeUpdate }
                />
            </ExpandableContent>
        );
    }

    renderPromo(showOnMobile = false) {
        const { checkoutStep, isMobile } = this.props;
        const isBilling = checkoutStep === BILLING_STEP;

        if (!showOnMobile && isMobile) {
            return null;
        }

        const {
            checkout_content: {
                [isBilling ? 'checkout_billing_cms' : 'checkout_shipping_cms']: promo
            } = {}
        } = window.contentConfiguration;

        if (!promo) {
            return null;
        }

        return <CmsBlock identifier={ promo } />;
    }

    renderProgressBar() {
        const { checkoutStep } = this.props
        let isShipping = checkoutStep === SHIPPING_STEP;
        let isBilling = checkoutStep === BILLING_STEP;
        let isDetails = checkoutStep === DETAILS_STEP;

        let class1 
        let class2
        let class3 
        let class4 
        let class5
        let text2Class  
        let text1 
        let text2 


        if (isShipping) {
            class1 = "pbar-1"
            class2 = "pbar-2"
            class3 = "pbar-3"
            class4 = "pbar-4"
            class5 = "pbar-5"
            text2Class = "circle-text"
            text1 = "1"
            text2 = "2"
        } else if (isBilling) {
            class1 = "pbar-1-over"
            class2 = "pbar-2"
            class3 = "pbar-3-compl"
            class4 = "pbar-4-compl"
            class5 = "pbar-5"
            text1 = "✓"
            text2 = "2"
            text2Class = "circle-text-full"
        } else if (isDetails) {
            class1 = "pbar-1-over"
            class2 = "pbar-2"
            class3 = "pbar-3-over"
            class4 = "pbar-4-over"
            class5 = "pbar-5-compl"
            text1 = "✓"
            text2 = "✓"
            text2Class = "circle-text-full"
        }

        return (
        <div className="pbar-outer-container">
            <div className="pbar-container">
                <div className={class1}></div>
                <div className={class2} style={{display: "grid"}}><p className="circle-text-full">{text1}</p></div>
                <div className={class3}></div>
                <div className={class4} style={{display: "grid"}}><p className={text2Class}>{text2}</p></div>
                <div className={class5}></div>
            </div>
            <div className="pbar-text-container">
            <p className="pbar-text1">Shipping</p>
            <p className="pbar-text2">Review & Payments</p>
            </div>
        </div>
        )
    }

    render() {
        return (
            <main block="Checkout">
                {this.renderProgressBar()}
                <ContentWrapper
                  wrapperMix={ { block: 'Checkout', elem: 'Wrapper' } }
                  label={ __('Checkout page') }
                >
                    { this.renderSummary(true) }
                    <div block="Checkout" elem="Step">
                        { this.renderTitle() }
                        { this.renderGuestForm() }
                        { this.renderStep() }
                        { this.renderLoader() }
                    </div>
                    
                    <div>
                        { this.renderSummary() }
                        { this.renderPromo() }
                        { this.renderCoupon() }
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}

export default Checkout;
