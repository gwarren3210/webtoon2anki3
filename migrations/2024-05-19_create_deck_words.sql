-- Create deck_words join table for SRS/SM-2 tracking per user/deck/word

CREATE TABLE deck_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- SRS/SM-2 fields
    state TEXT NOT NULL, -- e.g. 'new', 'learning', 'reviewing', 'mastered'
    interval INTEGER NOT NULL DEFAULT 0,
    e_factor REAL NOT NULL DEFAULT 2.5,
    consecutive_correct INTEGER NOT NULL DEFAULT 0,
    consecutive_incorrect INTEGER NOT NULL DEFAULT 0,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    next_review_date TIMESTAMP WITH TIME ZONE,
    last_reviewed_date TIMESTAMP WITH TIME ZONE,
    first_seen_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Ensure a user cannot have the same word in the same deck twice
    UNIQUE (deck_id, word_id, user_id)
);

-- Optional: Indexes for performance
CREATE INDEX idx_deck_words_deck_id ON deck_words(deck_id);
CREATE INDEX idx_deck_words_user_id ON deck_words(user_id);
CREATE INDEX idx_deck_words_word_id ON deck_words(word_id);
CREATE INDEX idx_deck_words_next_review_date ON deck_words(next_review_date); 