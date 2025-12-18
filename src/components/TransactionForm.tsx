// src/components/TransactionForm.tsx
'use client';

import React, { useState } from 'react';
import { bankFacade } from '@/facades/BankFacade';
import { CreateDepositDto, CreateWithdrawDto, CreateTransferDto } from '@/types';

type TransactionType = 'deposit' | 'withdraw' | 'transfer';

export const TransactionForm = () => {
  const [type, setType] = useState<TransactionType>('deposit');
  const [amount, setAmount] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Please enter a valid amount.');
      }

      let result;
      switch (type) {
        case 'deposit':
          const depositDto: CreateDepositDto = { amount: numericAmount };
          result = await bankFacade.performDeposit(depositDto);
          break;
        case 'withdraw':
          const withdrawDto: CreateWithdrawDto = { amount: numericAmount };
          result = await bankFacade.performWithdrawal(withdrawDto);
          break;
        case 'transfer':
          if (!toAccountId) throw new Error('Destination account ID is required for transfer.');
          const transferDto: CreateTransferDto = { amount: numericAmount, toAccountId };
          result = await bankFacade.performTransfer(transferDto);
          break;
      }

      setMessage({ text: `Transaction successful! ID: ${result.id}`, type: 'success' });
      setAmount('');
      setToAccountId('');
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message || 'Transaction failed.';
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const MessageDisplay = () => {
    if (!message) return null;
    const baseClass = "p-3 mb-4 text-sm rounded";
    const successClass = "text-green-700 bg-green-100";
    const errorClass = "text-red-700 bg-red-100";
    return (
      <div className={`${baseClass} ${message.type === 'success' ? successClass : errorClass}`} role="alert">
        {message.text}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <h3 className="text-xl font-semibold mb-4">Perform Transaction</h3>
      <MessageDisplay />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Transaction Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {type === 'transfer' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="toAccountId">
              Destination Account ID
            </label>
            <input
              id="toAccountId"
              type="text"
              placeholder="Recipient Account ID"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : `Submit ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </button>
      </form>
    </div>
  );
};
