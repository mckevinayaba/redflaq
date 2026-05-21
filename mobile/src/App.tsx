import React, { useState } from 'react';
import TabBar, { TabId } from './components/TabBar';
import { useAuth } from './hooks/useAuth';
import { useSavedChecks } from './hooks/useSavedChecks';
import { useSavedSignals } from './hooks/useSavedSignals';
import { useJournal } from './hooks/useJournal';
import { detectPatterns } from './data/tags';
import HomeScreen from './screens/HomeScreen';
import CheckScreen from './screens/CheckScreen';
import SignalsScreen from './screens/SignalsScreen';
import JournalScreen from './screens/JournalScreen';
import ConnectScreen from './screens/ConnectScreen';
import BaseScreen from './screens/BaseScreen';
import AuthScreen from './screens/AuthScreen';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const { checks, save: saveCheck, remove: removeCheck } = useSavedChecks();
  const { signals: savedSignals, save: saveSignal, remove: removeSignal } = useSavedSignals();
  const { entries: journalEntries, add: addEntry, update: updateEntry, remove: removeEntry, ready: journalReady } = useJournal();

  const goTo = (tab: TabId) => setActiveTab(tab);
  const journalPatterns = detectPatterns(journalEntries);

  if (authLoading) {
    return (
      <div style={{ height: '100dvh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(108,53,222,0.3)', borderTopColor: '#6C35DE', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onRunCheck={() => goTo('check')}
            onGoJournal={() => goTo('journal')}
            onGoSignals={() => goTo('signals')}
            journalPatterns={journalPatterns}
            journalEntryCount={journalEntries.length}
          />
        );
      case 'check':
        return <CheckScreen onSave={saveCheck} />;
      case 'signals':
        return (
          <SignalsScreen
            savedSignalIds={savedSignals.map(s => s.id)}
            onSaveSignal={saveSignal}
            onUnsaveSignal={removeSignal}
          />
        );
      case 'journal':
        return (
          <JournalScreen
            entries={journalEntries}
            ready={journalReady}
            onAdd={addEntry}
            onUpdate={updateEntry}
            onRemove={removeEntry}
            onGoSignals={(signalId) => {
              // Navigate to signals tab — signal deep-linking can be added later
              goTo('signals');
            }}
          />
        );
      case 'connect':
        return <ConnectScreen onGoCheck={() => goTo('check')} />;
      case 'base':
        return (
          <BaseScreen
            checks={checks}
            onRemove={removeCheck}
            onRunCheck={() => goTo('check')}
            savedSignals={savedSignals}
            onRemoveSignal={removeSignal}
            onGoSignals={() => goTo('signals')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#08080f', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {renderScreen()}
      </div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
