import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions, mockContacts, mockRequests, generateId, TRANSACTION_TYPE, CATEGORIES, REQUEST_STATUS } from '../data/transactions';

const ROLES = {
  VIEWER: 'viewer',
  ADMIN: 'admin',
};

const useFinanceStore = create(
  persist(
    (set, get) => ({
      // --- Wallet Cards ---
      walletCards: [
        {
          id: 'card_1',
          brand: 'ZORVYN',
          type: 'physical',
          cardNumber: '6549 7329 9821 2472',
          lastFour: '6549',
          holder: 'Jaylon Baptista',
          expiry: '12/28',
          cvv: '482',
          frozen: false,
          balance: 18450.00,
          spent: 3240.50,
          limit: 25000,
          color: 'dark',
          gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          createdAt: '2024-06-15',
        },
        {
          id: 'card_2',
          brand: 'Z-TITANIUM',
          type: 'physical',
          cardNumber: '4821 5539 7012 9821',
          lastFour: '9821',
          holder: 'Jaylon Baptista',
          expiry: '08/27',
          cvv: '715',
          frozen: false,
          balance: 6646.06,
          spent: 1820.30,
          limit: 15000,
          color: 'green',
          gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          createdAt: '2025-01-20',
        },
      ],

      addCard: (card) => {
        const lastFour = Math.floor(1000 + Math.random() * 9000).toString();
        const newCard = {
          ...card,
          id: `card_${Date.now()}`,
          cardNumber: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${lastFour}`,
          lastFour,
          cvv: Math.floor(100 + Math.random() * 900).toString(),
          frozen: false,
          spent: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          walletCards: [...state.walletCards, newCard],
        }));
        return newCard;
      },

      removeCard: (cardId) => {
        set((state) => ({
          walletCards: state.walletCards.filter((c) => c.id !== cardId),
        }));
      },

      toggleFreezeCard: (cardId) => {
        set((state) => ({
          walletCards: state.walletCards.map((c) =>
            c.id === cardId ? { ...c, frozen: !c.frozen } : c
          ),
        }));
      },

      // --- Card Modals ---
      selectedCard: null,
      cardDetailModalOpen: false,
      openCardDetail: (card) => set({ selectedCard: card, cardDetailModalOpen: true }),
      closeCardDetail: () => set({ selectedCard: null, cardDetailModalOpen: false }),

      createCardModalOpen: false,
      openCreateCardModal: () => set({ createCardModalOpen: true }),
      closeCreateCardModal: () => set({ createCardModalOpen: false }),

      // --- Connected Banks ---
      connectedBanks: [
        {
          id: 'bank_chase',
          name: 'Chase Priority Checking',
          lastFour: '3499',
          balance: 18450.00,
          color: '#0f172a',
          bgColor: '#f8fafc',
          borderColor: '#e2e8f0',
          type: 'Primary Account'
        },
        {
          id: 'bank_ally',
          name: 'Ally High-Yield Savings',
          lastFour: '8210',
          balance: 6646.06,
          color: '#c026d3',
          bgColor: '#fdf4ff',
          borderColor: '#fae8ff',
          type: 'Savings Account'
        }
      ],

      addConnectedBank: (bank) => {
        const newBank = {
          ...bank,
          id: `bank_${Date.now()}`,
          lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
        };
        set((state) => ({
          connectedBanks: [...state.connectedBanks, newBank],
        }));
      },

      removeConnectedBank: (bankId) => {
        set((state) => ({
          connectedBanks: state.connectedBanks.filter((b) => b.id !== bankId),
        }));
      },

      transferFromBank: (bankId, amount) => {
        set((state) => ({
          connectedBanks: state.connectedBanks.map((b) =>
            b.id === bankId ? { ...b, balance: b.balance - parseFloat(amount) } : b
          )
        }));
        
        const bank = get().connectedBanks.find((b) => b.id === bankId);
        get().addTransaction({
          date: new Date().toISOString().split('T')[0],
          description: `Quick Transfer from ${bank?.name || 'Bank'}`,
          amount: parseFloat(amount),
          category: CATEGORIES.TRANSFER,
          type: TRANSACTION_TYPE.EXPENSE,
          fromAccount: bank?.name,
        });
      },

      connectBankModalOpen: false,
      openConnectBankModal: () => set({ connectBankModalOpen: true }),
      closeConnectBankModal: () => set({ connectBankModalOpen: false }),

      // --- Transactions ---
      transactions: mockTransactions,

      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: generateId(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((txn) =>
            txn.id === id ? { ...txn, ...updates } : txn
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((txn) => txn.id !== id),
        }));
      },

      // --- Contacts ---
      contacts: mockContacts,

      addContact: (contact) => {
        const newContact = {
          ...contact,
          id: `ct_${Date.now()}`,
        };
        set((state) => ({
          contacts: [...state.contacts, newContact],
        }));
      },

      // --- Money Requests ---
      moneyRequests: mockRequests,

      addMoneyRequest: (request) => {
        const newRequest = {
          ...request,
          id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          date: new Date().toISOString().split('T')[0],
          status: REQUEST_STATUS.PENDING,
        };
        set((state) => ({
          moneyRequests: [newRequest, ...state.moneyRequests],
        }));
      },

      updateRequestStatus: (requestId, status) => {
        set((state) => ({
          moneyRequests: state.moneyRequests.map((req) =>
            req.id === requestId ? { ...req, status } : req
          ),
        }));
      },

      fulfillRequest: (requestId) => {
        const { moneyRequests } = get();
        const request = moneyRequests.find((r) => r.id === requestId);
        if (!request) return;

        // Mark as completed
        get().updateRequestStatus(requestId, REQUEST_STATUS.COMPLETED);

        // Add income transaction
        get().addTransaction({
          date: new Date().toISOString().split('T')[0],
          description: `Payment from ${request.fromContact.name}`,
          amount: request.amount,
          category: CATEGORIES.REQUEST,
          type: TRANSACTION_TYPE.INCOME,
        });
      },

      // --- Send Money ---
      sendMoney: (recipient, amount, note, fromAccount) => {
        const desc = `Sent to ${recipient.name}`;
        get().addTransaction({
          date: new Date().toISOString().split('T')[0],
          description: desc,
          amount: parseFloat(amount),
          category: CATEGORIES.TRANSFER,
          type: TRANSACTION_TYPE.EXPENSE,
          recipient: recipient.name,
          note: note || '',
          fromAccount: fromAccount || '',
        });
      },

      // --- Request Money ---
      requestMoney: (contacts, amount, note) => {
        contacts.forEach((contact) => {
          get().addMoneyRequest({
            fromContact: contact,
            amount: parseFloat(amount),
            note: note || '',
            type: 'outgoing',
          });
        });
      },

      // --- Send Money Modal ---
      sendMoneyModalOpen: false,
      openSendMoneyModal: () => set({ sendMoneyModalOpen: true }),
      closeSendMoneyModal: () => set({ sendMoneyModalOpen: false }),

      // --- Request Money Modal ---
      requestMoneyModalOpen: false,
      openRequestMoneyModal: () => set({ requestMoneyModalOpen: true }),
      closeRequestMoneyModal: () => set({ requestMoneyModalOpen: false }),

      // --- Filters ---
      searchQuery: '',
      filterType: 'all',
      sortField: 'date',
      sortDirection: 'desc',

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (type) => set({ filterType: type }),

      setSorting: (field) => {
        const { sortField, sortDirection } = get();
        if (sortField === field) {
          set({ sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' });
        } else {
          set({ sortField: field, sortDirection: 'desc' });
        }
      },

      // --- Derived: Filtered & Sorted Transactions ---
      getFilteredTransactions: () => {
        const { transactions, searchQuery, filterType, sortField, sortDirection } = get();

        let filtered = [...transactions];

        // Apply search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (txn) =>
              txn.description.toLowerCase().includes(query) ||
              txn.category.toLowerCase().includes(query)
          );
        }

        // Apply type filter
        if (filterType !== 'all') {
          filtered = filtered.filter((txn) => txn.type === filterType);
        }

        // Apply sort
        filtered.sort((a, b) => {
          let comparison = 0;
          if (sortField === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
          } else if (sortField === 'amount') {
            comparison = a.amount - b.amount;
          } else if (sortField === 'category') {
            comparison = a.category.localeCompare(b.category);
          }
          return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      // Helper to get transactions within the last N months
      getTransactionsByMonths: (months) => {
        const { transactions } = get();
        if (!months) return transactions;
        
        const now = new Date('2026-03-31');
        const startDate = new Date(now);
        startDate.setMonth(now.getMonth() - months + 1);
        startDate.setDate(1); // From the 1st of the Nth month back
        const startStr = startDate.toISOString().split('T')[0];
        
        return transactions.filter(t => t.date >= startStr);
      },

      // --- Financial Summaries ---
      getTotalIncome: (months) => {
        const txns = get().getTransactionsByMonths(months);
        return txns
          .filter((txn) => txn.type === TRANSACTION_TYPE.INCOME)
          .reduce((sum, txn) => sum + txn.amount, 0);
      },

      getTotalExpenses: (months) => {
        const txns = get().getTransactionsByMonths(months);
        return txns
          .filter((txn) => txn.type === TRANSACTION_TYPE.EXPENSE)
          .reduce((sum, txn) => sum + txn.amount, 0);
      },

      getTotalBalance: () => {
        return get().getTotalIncome() - get().getTotalExpenses();
      },

      // --- Monthly data for charts ---
      getMonthlyData: () => {
        const { transactions } = get();
        const monthlyMap = {};

        transactions.forEach((txn) => {
          const month = txn.date.substring(0, 7); // YYYY-MM
          if (!monthlyMap[month]) {
            monthlyMap[month] = { month, income: 0, expenses: 0, balance: 0 };
          }
          if (txn.type === TRANSACTION_TYPE.INCOME) {
            monthlyMap[month].income += txn.amount;
          } else {
            monthlyMap[month].expenses += txn.amount;
          }
          monthlyMap[month].balance = monthlyMap[month].income - monthlyMap[month].expenses;
        });

        return Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
      },

      // --- Category breakdown ---
      getCategoryBreakdown: (months) => {
        const txns = get().getTransactionsByMonths(months);
        const categoryMap = {};

        txns
          .filter((txn) => txn.type === TRANSACTION_TYPE.EXPENSE)
          .forEach((txn) => {
            if (!categoryMap[txn.category]) {
              categoryMap[txn.category] = 0;
            }
            categoryMap[txn.category] += txn.amount;
          });

        return Object.entries(categoryMap)
          .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
          .sort((a, b) => b.value - a.value);
      },

      // --- Insights ---
      getInsights: (months) => {
        const txns = get().getTransactionsByMonths(months);

        // Highest spending category
        const categoryMap = {};
        const monthlyExpenses = {};
        const monthlyIncome = {};

        txns.forEach((txn) => {
          const month = txn.date.substring(0, 7);
          if (txn.type === TRANSACTION_TYPE.EXPENSE) {
            categoryMap[txn.category] = (categoryMap[txn.category] || 0) + txn.amount;
            monthlyExpenses[month] = (monthlyExpenses[month] || 0) + txn.amount;
          } else {
            monthlyIncome[month] = (monthlyIncome[month] || 0) + txn.amount;
          }
        });

        const sortedCategories = Object.entries(categoryMap).sort(([, a], [, b]) => b - a);
        const highestCategory = sortedCategories[0] || ['N/A', 0];
        const lowestCategory = sortedCategories[sortedCategories.length - 1] || ['N/A', 0];

        // Monthly comparison
        const sortedMonths = Object.keys(monthlyExpenses).sort();
        const currentMonth = sortedMonths[sortedMonths.length - 1];
        const previousMonth = sortedMonths[sortedMonths.length - 2];

        const currentExpense = monthlyExpenses[currentMonth] || 0;
        const previousExpense = monthlyExpenses[previousMonth] || 0;

        let spendingChangePercent = 0;
        if (previousExpense > 0) {
          spendingChangePercent = ((currentExpense - previousExpense) / previousExpense) * 100;
        }

        const currentIncome = monthlyIncome[currentMonth] || 0;
        const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpense) / currentIncome) * 100 : 0;

        const totalExpense = Object.values(categoryMap).reduce((s, v) => s + v, 0);
        const highestCategoryPercent = totalExpense > 0 ? (highestCategory[1] / totalExpense) * 100 : 0;

        const avgDailySpend = currentExpense / 30;

        return {
          highestCategory: {
            name: highestCategory[0],
            amount: highestCategory[1],
            percent: highestCategoryPercent,
          },
          lowestCategory: {
            name: lowestCategory[0],
            amount: lowestCategory[1],
          },
          spendingChange: {
            percent: spendingChangePercent,
            currentMonth: currentMonth,
            previousMonth: previousMonth,
            increased: spendingChangePercent > 0,
          },
          savingsRate: {
            percent: savingsRate,
            currentMonth: currentMonth,
          },
          averageDailySpend: avgDailySpend,
          totalCategories: sortedCategories.length,
        };
      },

      // --- Advanced Analytics for Insights Page ---

      // Weekly spending over time frame
      getWeeklySpending: (months = 6) => {
        const { transactions } = get();
        const now = new Date('2026-03-28');
        const weeks = [];
        
        const numWeeks = months === 3 ? 12 : months === 6 ? 26 : 52;

        for (let i = numWeeks - 1; i >= 0; i--) {
          const weekEnd = new Date(now);
          weekEnd.setDate(now.getDate() - (i * 7));
          const weekStart = new Date(weekEnd);
          weekStart.setDate(weekEnd.getDate() - 6);

          const weekTxns = transactions.filter((txn) => {
            const d = new Date(txn.date);
            return d >= weekStart && d <= weekEnd;
          });

          const income = weekTxns.filter(t => t.type === TRANSACTION_TYPE.INCOME).reduce((s, t) => s + t.amount, 0);
          const expenses = weekTxns.filter(t => t.type === TRANSACTION_TYPE.EXPENSE).reduce((s, t) => s + t.amount, 0);

          const label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
          weeks.push({ week: label, income, expenses, net: income - expenses });
        }
        return weeks;
      },

      // Daily spending heatmap
      getDailyHeatmap: (months = 3) => {
        const { transactions } = get();
        const now = new Date('2026-03-28');
        const days = [];
        
        const numDays = months === 3 ? 90 : months === 6 ? 180 : 365;

        for (let i = numDays - 1; i >= 0; i--) {
          const day = new Date(now);
          day.setDate(now.getDate() - i);
          const dateStr = day.toISOString().split('T')[0];

          const dayExpenses = transactions
            .filter(t => t.date === dateStr && t.type === TRANSACTION_TYPE.EXPENSE)
            .reduce((s, t) => s + t.amount, 0);

          days.push({
            date: dateStr,
            day: day.getDate(),
            month: day.getMonth(),
            dayOfWeek: day.getDay(),
            amount: dayExpenses,
          });
        }
        return days;
      },

      // Category trends over months (for stacked area / bar chart)
      getCategoryTrends: (months) => {
        const txns = get().getTransactionsByMonths(months);
        const monthCatMap = {};

        txns.filter(t => t.type === TRANSACTION_TYPE.EXPENSE).forEach((txn) => {
          const month = txn.date.substring(0, 7);
          if (!monthCatMap[month]) monthCatMap[month] = {};
          monthCatMap[month][txn.category] = (monthCatMap[month][txn.category] || 0) + txn.amount;
        });

        const sortedMonths = Object.keys(monthCatMap).sort();
        return sortedMonths.map(month => ({
          month,
          ...monthCatMap[month],
        }));
      },

      // Income sources breakdown
      getIncomeBreakdown: (months) => {
        const txns = get().getTransactionsByMonths(months);
        const incomeMap = {};

        txns.filter(t => t.type === TRANSACTION_TYPE.INCOME).forEach((txn) => {
          incomeMap[txn.category] = (incomeMap[txn.category] || 0) + txn.amount;
        });

        const total = Object.values(incomeMap).reduce((s, v) => s + v, 0);
        return Object.entries(incomeMap)
          .map(([name, value]) => ({
            name,
            value: Math.round(value * 100) / 100,
            percent: total > 0 ? Math.round((value / total) * 1000) / 10 : 0,
          }))
          .sort((a, b) => b.value - a.value);
      },

      // Financial health score (0-100)
      getFinancialHealthScore: (months) => {
        const insights = get().getInsights(months);
        const monthlyData = get().getMonthlyData();

        let score = 50; // Base score

        // Savings rate contribution (max 30 points)
        if (insights.savingsRate.percent > 30) score += 30;
        else if (insights.savingsRate.percent > 20) score += 25;
        else if (insights.savingsRate.percent > 10) score += 15;
        else if (insights.savingsRate.percent > 0) score += 5;
        else score -= 10;

        // Spending trend (max 15 points)
        if (!insights.spendingChange.increased) score += 15;
        else if (insights.spendingChange.percent < 5) score += 5;
        else score -= 5;

        // Diversification bonus (max 5 points)
        if (insights.totalCategories >= 8) score += 5;
        else if (insights.totalCategories >= 5) score += 3;

        // Income growth
        if (monthlyData.length >= 2) {
          const last = monthlyData[monthlyData.length - 1];
          const prev = monthlyData[monthlyData.length - 2];
          if (last.income > prev.income) score += 5;
        }

        return Math.min(100, Math.max(0, score));
      },

      // Spending velocity - rate of spending in current month vs previous
      getSpendingVelocity: () => {
        const { transactions } = get();
        const months = {};

        transactions.filter(t => t.type === TRANSACTION_TYPE.EXPENSE).forEach((txn) => {
          const month = txn.date.substring(0, 7);
          if (!months[month]) months[month] = [];
          months[month].push({ date: txn.date, amount: txn.amount });
        });

        const sortedMonths = Object.keys(months).sort();
        const currentMonth = sortedMonths[sortedMonths.length - 1];

        if (!currentMonth || !months[currentMonth]) return [];

        // Cumulative spending over days of the current month
        const dailyMap = {};
        months[currentMonth].forEach(({ date, amount }) => {
          const day = parseInt(date.split('-')[2]);
          dailyMap[day] = (dailyMap[day] || 0) + amount;
        });

        const result = [];
        let cumulative = 0;
        for (let d = 1; d <= 31; d++) {
          cumulative += dailyMap[d] || 0;
          result.push({ day: d, amount: cumulative });
        }

        // Also get previous month for comparison
        const prevMonth = sortedMonths[sortedMonths.length - 2];
        if (prevMonth && months[prevMonth]) {
          const prevDailyMap = {};
          months[prevMonth].forEach(({ date, amount }) => {
            const day = parseInt(date.split('-')[2]);
            prevDailyMap[day] = (prevDailyMap[day] || 0) + amount;
          });

          let prevCum = 0;
          result.forEach((item) => {
            prevCum += prevDailyMap[item.day] || 0;
            item.prevAmount = prevCum;
          });
        }

        return result;
      },

      // Top merchants / descriptions by frequency and amount
      getTopMerchants: (months) => {
        const txns = get().getTransactionsByMonths(months);
        const merchantMap = {};

        txns.filter(t => t.type === TRANSACTION_TYPE.EXPENSE).forEach((txn) => {
          const key = txn.description;
          if (!merchantMap[key]) {
            merchantMap[key] = { name: key, category: txn.category, totalAmount: 0, count: 0 };
          }
          merchantMap[key].totalAmount += txn.amount;
          merchantMap[key].count += 1;
        });

        return Object.values(merchantMap)
          .sort((a, b) => b.totalAmount - a.totalAmount)
          .slice(0, 10);
      },

      // Budget utilization per category (mock realistic budgets)
      getBudgetUtilization: (months) => {
        const categoryBreakdown = get().getCategoryBreakdown(months);
        const divMonths = months || 12;

        // Define average monthly budgets
        const budgets = {
          'Rent': 1850,
          'Food & Dining': 350,
          'Shopping': 400,
          'Transport': 150,
          'Bills & Utilities': 300,
          'Entertainment': 200,
          'Healthcare': 250,
          'Travel': 500,
          'Education': 100,
        };

        return categoryBreakdown
          .filter(cat => budgets[cat.name])
          .map(cat => {
            const monthlyAvg = cat.value / divMonths;
            const budget = budgets[cat.name];
            const utilization = budget > 0 ? (monthlyAvg / budget) * 100 : 0;
            return {
              name: cat.name,
              spent: Math.round(monthlyAvg),
              budget,
              utilization: Math.round(utilization),
              status: utilization > 100 ? 'over' : utilization > 80 ? 'warning' : 'good',
            };
          });
      },

      // Cash flow projection (next 3 months)
      getCashFlowProjection: () => {
        const monthlyData = get().getMonthlyData();
        if (monthlyData.length < 3) return [];

        const last3 = monthlyData.slice(-3);
        const avgIncome = last3.reduce((s, m) => s + m.income, 0) / 3;
        const avgExpenses = last3.reduce((s, m) => s + m.expenses, 0) / 3;

        // Add slight growth/variance
        const projections = [];
        const currentDate = new Date('2026-03-28');

        for (let i = 1; i <= 3; i++) {
          const projMonth = new Date(currentDate);
          projMonth.setMonth(currentDate.getMonth() + i);
          const monthStr = `${projMonth.getFullYear()}-${String(projMonth.getMonth() + 1).padStart(2, '0')}`;

          const incomeVar = 1 + (Math.random() * 0.1 - 0.02);
          const expenseVar = 1 + (Math.random() * 0.08 - 0.02);

          projections.push({
            month: monthStr,
            income: Math.round(avgIncome * incomeVar),
            expenses: Math.round(avgExpenses * expenseVar),
            projected: true,
          });
        }

        return [...monthlyData, ...projections];
      },

      // Year-over-year comparison
      getYearOverYear: () => {
        const monthlyData = get().getMonthlyData();
        const result = {};

        monthlyData.forEach(m => {
          const [year, month] = m.month.split('-');
          if (!result[month]) result[month] = {};
          result[month][year] = {
            income: m.income,
            expenses: m.expenses,
            savings: m.income - m.expenses,
          };
        });

        return result;
      },

      // --- User Role ---
      userRole: ROLES.ADMIN,
      setUserRole: (role) => set({ userRole: role }),

      isAdmin: () => get().userRole === ROLES.ADMIN,
      isViewer: () => get().userRole === ROLES.VIEWER,

      // --- Permission Methods ---
      canEditCards: () => get().isAdmin(),
      canDeleteCards: () => get().isAdmin(),
      canCreateCards: () => get().isAdmin(),
      canFreezeCards: () => get().isAdmin(),
      canConnectBanks: () => get().isAdmin(),
      canDisconnectBanks: () => get().isAdmin(),
      canEditTransactions: () => get().isAdmin(),
      canDeleteTransactions: () => get().isAdmin(),
      canCreateTransactions: () => get().isAdmin(),
      canSendMoney: () => get().isAdmin(),
      canRequestMoney: () => get().isAdmin(),
      canAccessSettings: () => get().isAdmin(),
      canUpdateProfile: () => get().isAdmin(),
      canUpdateSecurity: () => get().isAdmin(),

      // Check specific action permissions
      checkPermission: (action) => {
        const permissionsMap = {
          'edit_card': get().canEditCards(),
          'delete_card': get().canDeleteCards(),
          'create_card': get().canCreateCards(),
          'freeze_card': get().canFreezeCards(),
          'connect_bank': get().canConnectBanks(),
          'disconnect_bank': get().canDisconnectBanks(),
          'edit_transaction': get().canEditTransactions(),
          'delete_transaction': get().canDeleteTransactions(),
          'create_transaction': get().canCreateTransactions(),
          'send_money': get().canSendMoney(),
          'request_money': get().canRequestMoney(),
          'access_settings': get().canAccessSettings(),
          'update_profile': get().canUpdateProfile(),
          'update_security': get().canUpdateSecurity(),
        };
        return permissionsMap[action] || false;
      },

      // --- Active Page ---
      activePage: 'dashboard',
      setActivePage: (page) => set({ activePage: page }),

      // --- Theme ---
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
      },

      // --- Settings ---
      profile: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      },
      updateProfile: (profileUpdates) => set((state) => ({
        profile: { ...state.profile, ...profileUpdates }
      })),

      preferences: {
        currency: 'USD',
        notifications: true,
      },
      updatePreferences: (prefUpdates) => set((state) => ({
        preferences: { ...state.preferences, ...prefUpdates }
      })),

      security: {
        twoFactorAuth: false,
      },
      updateSecurity: (secUpdates) => set((state) => ({
        security: { ...state.security, ...secUpdates }
      })),

      // --- Sidebar ---
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),

      // --- Loading state ---
      isLoading: true,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // --- Messages ---
      activeChat: null,
      setActiveChat: (contactId) => set({ activeChat: contactId }),
      
      chatMessages: {
        'ct_1': [
          { id: 'm1', text: "Hey, did you get the transfer I sent earlier?", sender: 'ct_1', time: '10:30 AM', date: 'Today' },
          { id: 'm2', text: "Yes, just got it! Thanks.", sender: 'me', time: '10:35 AM', date: 'Today' }
        ],
        'ct_2': [
          { id: 'm3', text: "Thanks for covering lunch today!", sender: 'ct_2', time: 'Yesterday', date: 'Yesterday' },
          { id: 'm4', text: "No problem, we'll split next time.", sender: 'me', time: 'Yesterday', date: 'Yesterday' }
        ],
        'ct_3': [
          { id: 'm5', text: "Can you review the latest invoice when you have time?", sender: 'ct_3', time: 'Monday', date: 'Monday' }
        ],
        'ct_4': [
          { id: 'm6', text: "Just sent you a money request for the concert tickets.", sender: 'ct_4', time: 'Sunday', date: 'Sunday' }
        ]
      },
      addChatMessage: (contactId, text, attachment = null) => set((state) => {
        const newMessage = {
          id: `msg_${Date.now()}`,
          text: text,
          attachment: attachment, // { type: 'image' | 'file', url: string, name: string }
          sender: 'me',
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          date: 'Today'
        };
        const currentMessages = state.chatMessages[contactId] || [];
        return {
          chatMessages: {
            ...state.chatMessages,
            [contactId]: [...currentMessages, newMessage]
          }
        };
      }),
      
      clearMessages: (contactId) => set((state) => ({
        chatMessages: {
          ...state.chatMessages,
          [contactId]: []
        }
      })),
      
      deleteChat: (contactId) => set((state) => {
        const { [contactId]: _, ...rest } = state.chatMessages;
        return {
          chatMessages: rest,
          activeChat: state.activeChat === contactId ? null : state.activeChat
        };
      }),

      // --- Modal ---
      modalOpen: false,
      editingTransaction: null,
      openModal: (transaction = null) => set({ modalOpen: true, editingTransaction: transaction }),
      closeModal: () => set({ modalOpen: false, editingTransaction: null }),
    }),
    {
      name: 'zorvyn-finance-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        theme: state.theme,
        userRole: state.userRole,
        contacts: state.contacts,
        moneyRequests: state.moneyRequests,
        walletCards: state.walletCards,
        connectedBanks: state.connectedBanks,
        profile: state.profile,
        preferences: state.preferences,
        security: state.security,
        chatMessages: state.chatMessages,
      }),
    }
  )
);

export { ROLES };
export default useFinanceStore;
