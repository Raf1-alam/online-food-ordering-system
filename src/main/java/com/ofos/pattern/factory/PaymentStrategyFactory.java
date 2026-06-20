package com.ofos.pattern.factory;

import com.ofos.exception.UnsupportedPaymentMethodException;
import com.ofos.model.enums.PaymentMethod;
import com.ofos.pattern.strategy.PaymentStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Factory for resolving payment strategies at runtime.
 * 
 * Factory Pattern: Uses Spring's dependency injection to auto-discover
 * all PaymentStrategy implementations and register them by their PaymentMethod.
 * 
 * OCP: Adding a new payment method (e.g., Nagad) requires:
 * 1. Create NagadPaymentStrategy implements PaymentStrategy
 * 2. Add NAGAD to PaymentMethod enum
 * That's it — this factory auto-discovers it via Spring, zero code changes here.
 */
@Component
public class PaymentStrategyFactory {

    private final Map<PaymentMethod, PaymentStrategy> strategies;

    @Autowired
    public PaymentStrategyFactory(List<PaymentStrategy> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(
                        PaymentStrategy::getPaymentMethod,
                        strategy -> strategy
                ));
    }

    /**
     * Resolves the payment strategy for the given method.
     *
     * @param method The payment method to resolve
     * @return The corresponding PaymentStrategy implementation
     * @throws UnsupportedPaymentMethodException if no strategy exists for the method
     */
    public PaymentStrategy getStrategy(PaymentMethod method) {
        return Optional.ofNullable(strategies.get(method))
                .orElseThrow(() -> new UnsupportedPaymentMethodException(method));
    }
}
