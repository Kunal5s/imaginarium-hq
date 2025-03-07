
interface PayPalActions {
  subscription: {
    create: (options: { plan_id: string }) => Promise<any>;
  };
}

interface PayPalData {
  subscriptionID?: string;
}

interface PayPalButton {
  render: (selector: string) => void;
}

interface PayPalNamespace {
  Buttons: (config: {
    style: {
      shape: string;
      color: string;
      layout: string;
      label: string;
    };
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
