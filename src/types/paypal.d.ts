
interface PayPalActions {
  subscription: {
    create: (options: { plan_id: string }) => Promise<any>;
  };
  order?: {
    create: (options: any) => Promise<any>;
  };
}

interface PayPalData {
  subscriptionID?: string;
  orderID?: string;
}

interface PayPalButton {
  render: (selector: string) => Promise<void>;
}

interface PayPalNamespace {
  Buttons: (config: {
    style: {
      shape: string;
      color: string;
      layout: string;
      label: string;
    };
    createOrder?: (data: any, actions: PayPalActions) => any;
    createSubscription: (data: any, actions: PayPalActions) => Promise<any>;
    onApprove: (data: PayPalData, actions: any) => void;
    onError?: (err: any) => void;
  }) => PayPalButton;
}

declare global {
  interface Window {
    paypal: PayPalNamespace;
  }
}

export {};
