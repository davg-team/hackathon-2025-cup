package telegram

import (
	"context"
	"log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

// BotService предоставляет функции для отправки сообщений через Telegram-бота
type BotService struct {
	bot *tgbotapi.BotAPI
}

// NewBotService создает новый экземпляр BotService
func NewBotService(token string) (*BotService, error) {
	bot, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		return nil, err
	}

	return &BotService{bot: bot}, nil
}

// BroadcastMessage отправляет сообщение списку пользователей
func (s *BotService) BroadcastMessage(ctx context.Context, chatIDs []int64, message string) {
	for _, chatID := range chatIDs {
		msg := tgbotapi.NewMessage(chatID, message)
		msg.ParseMode = "Markdown"
		_, err := s.bot.Send(msg)
		if err != nil {
			log.Printf("Ошибка при отправке сообщения в чат %d: %v", chatID, err)
		} else {
			log.Printf("Сообщение успешно отправлено в чат %d", chatID)
		}
	}
}
