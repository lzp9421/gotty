package server

import (
	"github.com/gorilla/websocket"
	"io/ioutil"
)

type wsWrapper struct {
	*websocket.Conn
}

func (wsw *wsWrapper) Write(p []byte) (n int, err error) {
	writer, err := wsw.Conn.NextWriter(websocket.TextMessage)
	if err != nil {
		return 0, err
	}
	defer writer.Close()
	return writer.Write(p)
}

func (wsw *wsWrapper) Read() (data []byte, err error) {
	for {
		msgType, reader, err := wsw.Conn.NextReader()
		if err != nil {
			return nil, err
		}

		if msgType != websocket.TextMessage {
			continue
		}

		return ioutil.ReadAll(reader)
	}
}
